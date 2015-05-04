class FilePickerFactory {
    constructor(componentFactory){
        this._componentFactory = componentFactory;
    }
    createFilePicker(){
        return this._componentFactory.createFilePicker();
    }
}

module.exports = FilePickerFactory;