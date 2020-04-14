/**
 * Constants
 */

const serverErrorBody = '<h1 style=\"text-align: center;\">Oops, something went wrong on our end.</h1>\n <h1 style=\"text-align: center;\">Please try again.</h1>';
const apiEndpoint = 'https://cfw-takehome.developers.workers.dev/api/variants';
const jsonVariantsKey = 'variants';
const newPageTitle = 'Garrett Egan';
const newMainTitle = 'Project complete';
const newDescription = 'Only one more thing to do...';
const newLinkDescription = 'Fill this in';
const newLink = 'https://google.com';

/**
 * HTMLRewriter classes
 */

class ContentRewriter {
  constructor(newContent) {
    this.newContent = newContent
  }

  element(element) {
    element.setInnerContent(this.newContent);
  }
}

class AttributeRewriter {
  constructor(attributeName, newValue) {
    this.attributeName = attributeName;
    this.newValue = newValue;
  }

  element(element) {
    const attribute = element.getAttribute(this.attributeName)
    if (attribute) {
      element.setAttribute(this.attributeName, this.newValue);
    }
  }
}

const rewriter = new HTMLRewriter()
    .on('title', new ContentRewriter(newPageTitle))
    .on('h1#title', new ContentRewriter(newMainTitle))
    .on('p#description', new ContentRewriter(newDescription))
    .on('a#url', new ContentRewriter(newLinkDescription))
    .on('a#url', new AttributeRewriter('href', newLink));

// Will hold array of URLs once it has been retrieved
let urls = null;

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})


/**
 * Respond to GET request with one of the given URLs,
 * modified with our data
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
  // before modifying and returning it to the user
  const index = Math.floor(Math.random() * urls.length);
  const url = urls[index];
  console.debug('Redirecting to variant: ' + (index + 1) + ' at url: ' + url);

  const response = await fetch(url);

  return rewriter.transform(response);
}
