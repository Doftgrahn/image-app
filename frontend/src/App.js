import React, { useState, useEffect } from 'react';
import './App.css';
import ShowCurrentImages from './components/showCurrentImages';
const API_ROOT_URL = process.env.API_ROOT_URL || 'http://localhost:3002';

const App = () => {
    const [file, setFile] = useState(null);
    const [images, setImages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [name, setName] = useState('');
    const [nameError, setNameError] = useState('');
    const [fileError, setFileError] = useState('');
    const [sucess, setSuccess] = useState(false);
    const [toggleMenu, setToggleMenu] = useState(false);

    useEffect(() => {
        const fetchImages = async () => {
            setIsLoading(true);
            try {
                const req = await fetch(`${API_ROOT_URL}/images`);
                const res = await req.json();
                setImages(res.data);
                setIsLoading(false);
                setSuccess(false);
            } catch (e) {
                setFileError(e.status);
            }
        };
        fetchImages();
    }, []);

    const fileHandler = (e) => {
        setFileError('');
        setFile(e.target.files[0]);
    };

    const uploadImage = async (e) => {
        e.preventDefault();
        if (!name)
            return setNameError(
                'Du måste skriva in ett namn för att kunna ladda upp en bild!'
            );

        const formData = new FormData();
        formData.append('photo', file, name);

        try {
            const req = await fetch(`${API_ROOT_URL}/images`, {
                method: 'POST',
                body: formData,
            });
            const res = await req.json();
            if (res.status === 'fail') {
                setFile(null);
                setSuccess(false);
                setName('');
                return setFileError(
                    'Fel filtyp, accepterar bara jpeg och png! :D'
                );
            }

            setImages([...images, res.data.data]);
            setSuccess(true);
            setFile(null);
            setName('');
        } catch (error) {
            console.log(error);
        }
    };

    const toggleSideMenu = () => setToggleMenu(!toggleMenu);

    if (isLoading) {
        return (
            <div className='spinner'>
                <span />
            </div>
        );
    }

    return (
        <div className='App'>
            <section className='App-container'>
                {!!images.length && (
                    <button className='toggle-btn' onClick={toggleSideMenu}>
                        {!toggleMenu
                            ? images.length && `${images.length} Bild/er`
                            : 'Stäng'}
                    </button>
                )}
                <form onSubmit={uploadImage}>
                    {!file && (
                        <div className='uppload'>
                            <h1>Ladda upp dina fantastiska bilder!</h1>
                            <input
                                autoFocus
                                className='upload'
                                type='file'
                                name='file'
                                id='file'
                                onChange={fileHandler}
                            />
                            <label htmlFor='file' className='btn'>
                                Välj fil!
                            </label>
                        </div>
                    )}
                    {file && (
                        <>
                            <label htmlFor='name' className='name-label'>
                                Skriv vad bilden skall ha för namn!
                            </label>
                            <input
                                autoFocus
                                tabIndex='0'
                                id='name'
                                className='name-input'
                                type='text'
                                value={name}
                                onChange={(e) => {
                                    setName(e.target.value);
                                    setNameError('');
                                }}
                                placeholder='Titel..'
                            />
                            <button type='submit'>Ladda upp</button>
                        </>
                    )}
                </form>
                <div className='error_messages'>
                    <p> &nbsp; {sucess && !file && 'Bilden är uppladdad!'}</p>
                    <p> &nbsp;{nameError && nameError} </p>
                    <p> &nbsp;{fileError && fileError} </p>
                </div>
            </section>

            <section className={`gallery ${toggleMenu && 'active'}`}>
                <ShowCurrentImages
                    toggleSideMenu={toggleSideMenu}
                    images={images}
                />
            </section>
        </div>
    );
};

export default App;
