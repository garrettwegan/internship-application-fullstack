const serverErrorBody = '<h1 style=\"text-align: center;\">Oops, something went wrong on our end.</h1>\n <h1 style=\"text-align: center;\">Please try again.</h1>';
const apiEndpoint = 'https://cfw-takehome.developers.workers.dev/api/variants';
const jsonVariantsKey = 'variants';

let urls = null;

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

/**
 * Respond with one of the given URLs
 * @param {Request} request
 */
async function handleRequest(request) {

  // only make API call once, no need to retrieve
  // the URLs with every request
  if(!urls){
    try {
      const response = await fetch(apiEndpoint);
      const json = await response.json();
      urls = json[jsonVariantsKey];
    } catch (error) {
      console.error('Failed to retrieve URLs: ' + error.message);
      return new Response(serverErrorBody, {
        headers: { 'content-type': 'text/html' },
        status: 500
      });
    }
  }

  // randomly choose a URL and log the choice
  // before returning it to the user
  const index = Math.floor(Math.random() * urls.length);
  const url = urls[index];
  console.debug('Redirecting to variant: ' + (index + 1) + ' at url: ' + url);

  return fetch(url);
}
