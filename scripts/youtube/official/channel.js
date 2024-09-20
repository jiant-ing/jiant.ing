export async function handler(jiant) {
    const targetUrl = jiant.get.targetPageURL()
    const cache = jiant.get.cache()

    let { channelId, channelName } = await jiant.parse.pathRegExp(targetUrl, [
        '/channel/:channelId',
        '/:channelName'
    ])

    let cacheKeyName2Id = `youtube:name2id:`

    // get channelId from cache
    if (!channelId) {
        if (!channelName || !channelName.startsWith('@')) throw `Script does not fit current page: ${targetUrl}. Find others on https://jiant.ing`

        cacheKeyName2Id += channelName
        channelId = await cache.get(cacheKeyName2Id)
    }

    // fetch channelId
    if (!channelId) {
        await jiant.action.pushURL(targetUrl)
        const $ = await jiant.get.$()
        const ytInitialData = JSON.parse(
            $('script')
                .text()
                .match(/ytInitialData = ({.*?});/)?.[1] || '{}');
        channelId = ytInitialData.metadata.channelMetadataRenderer.externalId
        if (channelId) await cache.set(cacheKeyName2Id, channelId, 3600 * 24 * 31 * 3)
    }

    if (!channelId) throw `Unable to get youtube channelId`

    const rssOffical = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`

    const rssRes = await jiant.parse.rss({ url: rssOffical })

    rssRes.title += ' - YouTube'
    rssRes.pageTitle += ' - YouTube'

    return rssRes
}

