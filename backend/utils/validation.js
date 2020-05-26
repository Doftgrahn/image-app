const validateImgName = (name, extension) => {
    const newName = name
        .substr(0, 10)
        .replace(/\s+/g, '-')
        .replace(/å/g, 'a')
        .replace(/Å/g, 'A')
        .replace(/ä/g, 'a')
        .replace(/Ä/g, 'Ä')
        .replace(/ö/g, 'o')
        .replace(/Ö/g, 'O')
        .toLowerCase();

    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    const hour = today.getHours();
    const minutes = today.getMinutes();
    const seconds = today.getSeconds();

    const now = yyyy + mm + dd + hour + minutes + seconds;

    return `${newName}_${now}.${extension}`;
};

module.exports = { validateImgName };
