export async function printPageUrl(jiant) {
    let url = await jiant.get.pageURL()
    console.log('the current page URL is: ', url)
    return url
}