class FilePickerFactory {
    constructor(firefox){
        this._firefox = firefox;
    }
    createFilePicker(){
        return this._firefox.createFilePicker();
    }
}

module.exports = FilePickerFactory;