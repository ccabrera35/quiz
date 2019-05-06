const key = "12146703-4299ce10f0e65277d39d13834";

const background = location => {
    const url = `https://pixabay.com/api/?key=${key}&q=${location}&image_type=photo&per_page=200`;
    return fetch(url)
    .then(res => res.json())
    .then(data => data.hits.map(pic => {
        return pic.largeImageURL
    }))
    .catch(err => {
        console.log(err);
    })
}

export default background;