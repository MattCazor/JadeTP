import GifService from '@/lib/gif/gifService';
import React, { useState } from 'react';
import styles from './gif_picker.module.css';

type GifPickerProps = {
    setShouldOpenGifPicker: (shouldOpenGifPicker: boolean) => void
    sendGif: (gif: boolean, content: string) => Promise<void>
}

export const GifPicker = ({ setShouldOpenGifPicker, sendGif }: GifPickerProps): React.ReactNode => {

    // gif service to handle git fetch
    const gifService = new GifService();

    // gif search input
    const [gifSearch, setGifSearch] = useState('');
    // gifs fetched
    const [gifs, setGifs] = useState<string[]>([]);

    const [selectedGifToSend, setSelectedGifToSend] = useState<string>('');

    const searchGif = async () => {
        try {
            const gifs: string[] = await gifService.getGifs(gifSearch);
            setGifs(gifs);
        } catch (e: unknown) {
            alert('Failed to fetch gifs : ' + JSON.stringify(e));
        }
    }

    const displayGifs = () => {
        return gifs.map((gif, index) => {
            return (
                <img className={`${selectedGifToSend == gif ? styles.selected : ''}`} key={index} src={gif} alt="gif" onClick={() => setSelectedGifToSend(gif)} />
            )
        })
    }

    return (
        <article>
            <header>
                <button aria-label="Close" rel="prev" onClick={() => { setShouldOpenGifPicker(false) }}></button>
                <p>
                    <strong>Envoyer un GIF</strong>
                </p>
            </header>
            <fieldset role="group">
                <input
                    name="text"
                    type="text"
                    placeholder="Rechercher un GIF..."
                    value={gifSearch}
                    onChange={(e) => setGifSearch(e.target.value)}
                />
                <input type="submit" value="Rechercher" onClick={searchGif} />
            </fieldset>
            <section>
                <div className={styles.gif_picker}>
                    {displayGifs()}
                </div>
            </section>
            {selectedGifToSend !== '' && (
                <footer>
                    <button onClick={() => {
                        sendGif(true, selectedGifToSend)
                    }}>Envoyer</button>
                </footer>
            )}
        </article>
    )
}

export default GifPicker;