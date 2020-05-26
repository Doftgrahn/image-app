import React, { useState, useEffect } from 'react';
import './App.css';
import ShowCurrentImages from './components/showCurrentImages';

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
        setIsLoading(true);
        fetch('/images')
            .then((data) => data.json())
            .then((result) => {
                setImages(result.data);
                setIsLoading(false);
                setSuccess(false);
            })
            .catch((e) => {
                setFileError(e.status);
            });
    }, []);

    const fileHandler = (e) => setFile(e.target.files[0]);

    const uploadImage = async (e) => {
        e.preventDefault();
        if (!name)
            return setNameError(
                'Du måste skriva in ett namn för att kunna ladda upp en bild!'
            );

        const formData = new FormData();
        formData.append('photo', file, name);

        try {
            const req = await fetch('/images', {
                method: 'POST',
                body: formData,
            });
            const res = await req.json();
            if (res.status === 'fail') {
                setFile(null);
                setSuccess(false);
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
            <section className='App-header'>
                {!!images.length && (
                    <button className='toggle-btn' onClick={toggleSideMenu}>
                        {!toggleMenu ? 'Galleri' : 'Stäng'}
                    </button>
                )}
                <form onSubmit={uploadImage}>
                    {!file && (
                        <div className='uppload'>
                            <h1>Image Uploading App</h1>
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
                            <label htmlFor='name' className='name'>
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
