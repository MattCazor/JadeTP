class GifService {
    private apiKey: string = 'AIzaSyDqpJzo6IBYbPlXlRaylOijSGj0JNsVDT0';

    public async getGifs(search: string): Promise<string[]> {
        try {
            console.log(process.env);
            const response = await fetch(`https://tenor.googleapis.com/v2/search?key=${this.apiKey}&q=${search}&limit=4&country=FR`)
            const data = await response.json();
            return data.results.map((gif: any) => gif.media_formats.gif.url); // eslint-disable-line @typescript-eslint/no-explicit-any
        } catch {
            throw new Error('Failed to fetch gifs');
        }

    }
};

export default GifService