omniscience.factory('contentDirectoryService', function ($rootScope, eventService) {

	return {
		getAdditionalInformation: function getAdditionalInformation(service) {
			this.getSearchCapabilities(service);
			this.getSortCapabilities(service);
			this.x_GetRemoteSharingStatus(service);
		},
		getSearchCapabilities: function getSearchCapabilities(service) {
			return eventService.callService(service, "GetSearchCapabilities");
		},
		getSortCapabilities: function getSortCapabilities(service) {
			return eventService.callService(service, "GetSortCapabilities");
		},
		getSystemUpdateID: function getSystemUpdateID(service) {
			return eventService.callService(service, "GetSystemUpdateID");
		},
		browse: function browse(service, objectId, browseFlag, filter, startingIndex, requestedCount, sortCriteria) {
			return eventService.callService(service, "Browse", { ObjectId: objectId, BrowseFlag: browseFlag, Filter: filter, StartingIndex: startingIndex, RequestedCount: requestedCount, SortCriteria: sortCriteria });
		},
		search: function search(service, containerId, searchCriteria, filter, startingIndex, requestedCount, sortCriteria) {
			return eventService.callService(service, "Search", { ContainerId: containerId, SearchCriteria: searchCriteria, Filter: filter, StartingIndex: startingIndex, RequestedCount: requestedCount, SortCriteria: sortCriteria });
		},
		x_GetRemoteSharingStatus: function x_GetRemoteSharingStatus(service) {
			return eventService.callService(service, "X_GetRemoteSharingStatus");
		}
	};
});