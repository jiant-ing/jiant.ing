export async function printPageUrl(jiant) {
    console.log('the current page URL is: ', await jiant.get.pageURL())
}