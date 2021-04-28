export function parse_producers(content: any) {
    let producers: string[] = [];
    for (const producer of JSON.parse(content).pendingList) {
        // console.log(stringToHex(producer));
        producers.push(String(producer));
    }
    return producers;
}