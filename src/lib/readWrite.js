import {
  getSolidDataset,
  getThing, setThing,
  getStringNoLocale, setStringNoLocale,
  saveSolidDatasetAt
} from "@inrupt/solid-client";

const VCARD = "http://www.w3.org/2006/vcard/ns#fn"
const ERROR = {
  MISSING_WEB_ID: 'MISSING_WEB_ID',
  INVALID_WEB_ID: 'INVALID_WEB_ID',
}

// #########
// #  Utils
// #########
const getHref = (webId) => {
  if (webId === undefined) return;
  try {
    new URL(webId);
  } catch (_) {
    return;
  }

  const url = new URL(webId);
  // The webId can contain a hash fragment (e.g. `#me`) to refer to profile data
  // in the profile dataset. If we strip the hash, we get the URL of the full dataset.
  url.hash = "";
  return url.href
}

// #######################
// #  Write to profile
// #######################
export async function writeProfile(name, { webId, fetch }) {
  const href = getHref(webId);
  console.log(href, fetch)

  // To write to a profile, you must be authenticated. That is 
  // the role of the fetch parameter in the following call.
  let dataset = await getSolidDataset(href, { fetch });
  console.log('dataset', dataset)
  // The profile data is a "Thing" in the profile dataset.
  let profile = getThing(dataset, webId);
  console.log('profile', profile)
  // Using the name provided in text field, update the name in your profile.
  profile = setStringNoLocale(profile, VCARD, name);
  // Write back the profile to the dataset.
  dataset = setThing(dataset, profile);
  // Write back the dataset to your Pod.
  await saveSolidDatasetAt(href, dataset, { fetch });
  return true;
}

// #######################
// #  Read to profile
// #######################
export async function readProfile({ webId, fetch }) {
  console.log('readProfile', { webId, fetch })
  let href = getHref(webId)
  if (!href) { return { error: ERROR.INVALID_WEB_ID }; }
  console.log(href)
  let dataset;
  try {
    dataset = await getSolidDataset(href, { fetch });
    console.log('dataset', dataset)
  } catch (error) {
    return { error: 'noDataset' };
  }

  const profile = getThing(dataset, webId);
  console.log('profile', profile)

  // Get the formatted name (fn) using the property identifier
  // "http://www.w3.org/2006/vcard/ns#fn".
  const formattedName = getStringNoLocale(profile, VCARD);
  return { data: formattedName };
}
