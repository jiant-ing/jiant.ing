export async function handler(jiant) {
    let customParams = await jiant.get.customParams()

    let rssurls = customParams?.rssurls?.map(x => x.value).filter(x => !!x)

    if (!rssurls.length) throw 'No RSS URLs to merge'

    let items = []

    for (const url of rssurls) {
        let rssres = await jiant.parse.rss({ url })
        let idx = 0
        for (const item of rssres.items) {
            idx++
            if (idx > 10) continue
            let prev = await jiant.get.prevItem({ link: item.link })
            if (prev) continue
            items.push({
                ...item,
                author: rssres.title
            })
        }
    }

    return { items }
}