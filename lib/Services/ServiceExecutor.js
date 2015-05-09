const Constants = require('../Utilities/Constants');

class ServiceExecutor {
    constructor (serviceInfoFactory, executableServiceFactory, matchStickService){
        this._executableServiceFactory = executableServiceFactory;
        this._serviceInfoFactory = serviceInfoFactory;
        this._executableServices = {};
        //this._services[Constants.ServiceTypes.MatchStick] = matchstickService;  todo: fixme
        //this._services[Constants.ServiceTypes.Chromecast] = chromecastService;  todo: fixme
        //this._services[Constants.ServiceTypes.Firestick] = firestickService;  todo: fixme
    }
    callService(serviceControlUrl, serviceHash, serviceMethod, data){
        if(!serviceControlUrl || !serviceMethod)
            return;

        var serviceClass = this._executableServices[serviceHash];
        if(!serviceClass) return Promise.reject("Executable Service has not yet been created.");

        var serviceFunc = serviceClass[serviceMethod];
        if(typeof serviceFunc !== "function") return Promise.reject("Executable Service has been created, but, service function has not.");

        return serviceFunc(serviceControlUrl, data);
    }
    addExecutableServices(services){
        if(!Array.isArray(services)) return;
        services.forEach((basicServiceInfo) => {
            this._serviceInfoFactory.getDetailedServiceInformation(basicServiceInfo).then((detailedServiceInfo) => {
                var executableService = this._executableServiceFactory.create(detailedServiceInfo);
                if(!executableService) return;
                if(!this._executableServices.hasOwnProperty(detailedServiceInfo.hash))
                    this._executableServices[detailedServiceInfo.hash] = executableService;
                else
                    for (var methodName in executableService)
                        this._executableServices[detailedServiceInfo.hash][methodName] = executableService[methodName];
            }).catch(()=>{});
        });
    }
}

module.exports = ServiceExecutor;