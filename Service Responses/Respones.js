var response = {
    //urn:schemas-upnp-org:service:ConnectionManager:1
    ConnectionManager: {
        version: '1.0',
        GetProtocolInfo: function GetProtocolInfo(){
            return {
                Source: this.SourceProtocolInfo,
                Sink: this.SinkProtocolInfo
            };
        },
        GetCurrentConnectionIDs: function GetCurrentConnectionIDs(){ return ConnectionIDs; },
        GetCurrentConnectionInfo: function GetCurrentConnectionInfo(ConnectionID){
            return {
                RcsID: this.A_ARG_TYPE_RcsID,
                AVTransportID: this.A_ARG_TYPE_AVTransportID,
                ProtocolInfo: this.A_ARG_TYPE_ProtocolInfo,
                PeerConnectionManager: this.A_ARG_TYPE_ConnectionManager,
                PeerConnectionID: this.A_ARG_TYPE_ConnectionID,
                Direction: this.A_ARG_TYPE_Direction,
                Status: this.A_ARG_TYPE_ConnectionStatus
            };
        },
        SourceProtocolInfo: 'string', // sendevents = true
        SinkProtocolInfo: 'string', // sendevents = true
        CurrentConnectionIDs: 'string', // sendevents = true
        A_ARG_TYPE_ConnectionStatus: 'string', // sendevents = true allowedvalue: [ 'OK', 'ContentFormatMismatch', 'InsufficientBandwidth', 'UnreliableChannel', 'Unknown' ]
        A_ARG_TYPE_ConnectionManager: 'string', // sendevents = false
        A_ARG_TYPE_Direction: 'string', // sendevents = false allowedvalue: ['Input', 'Output' ]
        A_ARG_TYPE_ProtocolInfo: 'string', // sendevents = false
        A_ARG_TYPE_ConnectionID: 'i4', // sendevents = false
        A_ARG_TYPE_AVTransportID: 'i4', // sendevents = false
        A_ARG_TYPE_RcsID: 'i4', // sendevents = false
    },

    //urn:schemas-upnp-org:service:ContentDirectory:1
    ContentDirectory: {
        version: '1.0',
        GetSearchCapabilities: function GetSearchCapabilities(){ return SearchCaps; },
        GetSortCapabilities: function GetSortCapabilities(){ return SortCaps; },
        GetSystemUpdateID: function GetSystemUpdateID(){ return Id; },
        Browse: function Browse(ObjectID, BrowseFlag, Filter, StartingIndex, RequestedCount, SortCriteria){
            return {
                Result: this.A_ARG_TYPE_Result,
                NumberReturned: this.A_ARG_TYPE_Count,
                TotalMatches: this.A_ARG_TYPE_Count,
                UpdateID: this.A_ARG_TYPE_UpdateID
            };
        },
        Search: function Search(ContainerID, SearchCriteria, Filter, StartingIndex, RequestedCount, SortCriteria){
            return {
                Result: this.A_ARG_TYPE_Result,
                NumberReturned: this.A_ARG_TYPE_Count,
                TotalMatches: this.A_ARG_TYPE_Count,
                UpdateID: this.A_ARG_TYPE_UpdateID
            };
        },
        X_GetRemoteSharingStatus: function X_GetRemoteSharingStatus(){ return Status; },
        A_ARG_TYPE_ObjectID: 'string', // sendevents = false
        A_ARG_TYPE_Result: 'string', // sendevents = false
        A_ARG_TYPE_SearchCriteria: 'string', // sendevents = false
        A_ARG_TYPE_BrowseFlag: 'string', // sendevents = false allowedvalue: [ 'BrowseMetadata', 'BrowseDirectChildren' ]
        A_ARG_TYPE_Filter: 'string', // sendevents = false
        A_ARG_TYPE_SortCriteria: 'string', // sendevents = false
        A_ARG_TYPE_Index: 'ui4', // sendevents = false
        A_ARG_TYPE_Count: 'ui4', // sendevents = false
        A_ARG_TYPE_UpdateID: 'ui4', // sendevents = false
        SearchCapabilities: 'string', // sendevents = false
        SortCapabilities: 'string', // sendevents = false
        SystemUpdateID: 'ui4', // sendevents = true
        ContainerUpdateIDs: 'string', // sendevents = true
        X_RemoteSharingEnabled: 'boolean' // sendevents = true
    },

    //urn:schemas-sony-com:service:IRCC:1
    IRCC: {
        version: '1.0',
        X_SendIRCC: function(IRCCCode){},
        X_GetStatus: function X_GetStatus(CategoryCode){ 
            return {
                CurrentStatus: this.X_A_ARG_TYPE_CurrentStatus,
                CurrentCommandInfo: this.X_A_ARG_TYPE_CurrentCommandInfo
            };
        },
        X_A_ARG_TYPE_CategoryCode: 'string', // sendevents = false
        X_A_ARG_TYPE_CurrentCommandInfo: 'string', // sendevents = false
        X_A_ARG_TYPE_CurrentStatus: 'string', // sendevents = false  allowedvalues: [0, 801, 804, 805, 806 ]
        X_A_ARG_TYPE_IRCCCode: 'string', // sendevents = false
    },

    //urn:schemas-sony-com:service:Party:1
    Party: {
        version: '1.0',
        X_GetDeviceInfo: function X_GetDeviceInfo(){ 
            return {
                SingerCapability: X_A_ARG_TYPE_SingerCapability,
                TransportPort: X_A_ARG_TYPE_TransportPort
            }; 
        },
        X_GetState: function X_GetState(){ 
            return {
                PartyState: this.X_PartyState,
                PartyMode: this.X_PartyMode,
                PartySong: this.X_PartySong,
                SessionID: this.X_A_ARG_TYPE_SessionID,
                NumberOfListeners: this.X_NumberOfListeners,
                ListenerList: this.X_ListenerList,
                SingerUUID: this.X_A_ARG_TYPE_UUID,
                SingerSessionID: this.X_A_ARG_TYPE_SessionID

            };
        },
        X_Start: function X_Start(PartyMode, ListenerList){ return SingerSessionID},
        X_Entry: function X_Entry(SingerSessionID, ListenerList){},
        X_Leave: function X_Leave(SingerSessionID, ListenerList){},
        X_Abort: function X_Abort(SingerSessionID){},
        X_Invite: function X_Invite(PartyMode, SingerUUID, SingerSessionID){ return ListenerSessionID;},            
        X_Exit: function X_Exit(ListenerSessionID){},
        X_A_ARG_TYPE_SingerCapability: 'ui1', // sendevents = false
        X_A_ARG_TYPE_TransportPort: 'ui2', // sendevents = false
        X_PartyState: 'string', // sendevents = true
        X_PartyMode: 'string', // sendevents = false
        X_PartySong: 'string', // sendevents = false
        X_A_ARG_TYPE_SessionID: 'ui4', // sendevents = false
        X_NumberOfListeners: 'ui1', // sendevents = true
        X_ListenerList: 'string', // sendevents = false
        X_A_ARG_TYPE_UUID: 'string' // sendevents = false
    },

    //urn:schemas-upnp-org:service:Layer3Forwarding:1
    Layer3Forwarding: {
        version: '1.0',
        SetDefaultConnectionService: function SetDefaultConnectionService(NewDefaultConnectionService){this.DefaultConnectionService = NewDefaultConnectionService},
        GetDefaultConnectionService: function GetDefaultConnectionService(){ returns this.DefaultConnectionService; },
        DefaultConnectionService: "" //sendEvents = true
    },

    //urn:schemas-wifialliance-org:service:WFAWLANConfig:1
    WFAWLANConfig: {
        version: '1.0',
        DelAPSettings: function DelAPSettings(NewAPSettings){},
        DelSTASettings: function DelSTASettings(NewSTASettings){},
        GetAPSettings: function GetAPSettings(NewMessage){ return this.APSettings; },
        GetDeviceInfo: function GetDeviceInfo(){ return this.DeviceInfo; },
        GetSTASettings: function GetSTASettings(NewMessage){ return this.STASettings; },
        PutMessage: function PutMessage(NewInMessage){return this.OutMessage; },
        PutWLANResponse: function PutWLANResponse(NewMessage, NewWLANEventType, NewWLANEventMAC){},
        RebootAP: function RebootAP(NewAPSettings){},
        RebootSTA: function RebootSTA(NewSTASettings){},
        ResetAP: function ResetAP(NewMessage){},
        ResetSTA: function ResetSTA(NewMessage){},
        SetAPSettings: function SetAPSettings(NewAPSettings){},
        SetSelectedRegistrar: function SetSelectedRegistrar(NewMessage){},
        SetSTASettings: function SetSTASettings(NewSTASettings){},
        WLANResponse: 'bin.base64', //sendEvents = false
        WLANEventType: 'ui1', //sendEvents = false
        InMessage: 'bin.base64', //sendEvents = false
        OutMessage: 'bin.base64', //sendEvents = false
        APSettings: 'bin.base64', //sendEvents = false
        Message: 'bin.base64', //sendEvents = false
        STAStatus: 'ui1', //sendEvents = false
        WLANEventMAC: 'string', //sendEvents = false
        DeviceInfo: 'bin.base64', //sendEvents = false
        STASettings: 'bin.base64', //sendEvents = false
        APStatus: 'ui1', //sendEvents = true
        WLANEvent: 'bin.base64' //sendEvents = true
    },

    //urn:microsoft.com:service:X_MS_MediaReceiverRegistrar:1
    MediaReceiverRegistrar: {
        version: '1.0',
        IsAuthorized: function IsAuthorized(DeviceID){return Result;},
        RegisterDevice: function RegisterDevice(RegistrationReqMsg){ return RegistrationRespMsg;},
        IsValidated: function IsValidated(DeviceID){return Result;},
        A_ARG_TYPE_DeviceID: 'string', //sendEvents = false
        A_ARG_TYPE_Result: 'int', //sendEvents = false
            A_ARG_TYPE_RegistrationReqMsg: 'bin.base64', //sendEvents = false
            A_ARG_TYPE_RegistrationRespMsg: 'bin.base64', //sendEvents = false
        AuthorizationGrantedUpdateID: 'ui4', //sendEvents = true
        AuthorizationDeniedUpdateID: 'ui4', //sendEvents = true
        ValidationSucceededUpdateID: 'ui4', //sendEvents = true
        ValidationRevokedUpdateID: 'ui4' //sendEvents = true
    },

    //urn:schemas-upnp-org:service:AVTransport:1
    AVTransport: {
        version: '1.0',
        SetAVTransportURI: function SetAVTransportURI(InstanceID, CurrentURI, CurrentURIMetaData){},
        SetNextAVTransportURI: function SetNextAVTransportURI(InstanceID, NextURI, NextURIMetaData){},
        GetMediaInfo: function GetMediaInfo(InstanceID){
            return {
                NrTracks: this.NumberOfTracks,
                MediaDuration: this.CurrentMediaDuration,
                CurrentURI: this.AVTransportURI,
                CurrentURIMetaData: this.AVTransportURIMetaData,
                NextURI: this.NextAVTransportURI,
                NextURIMetaData: this.NextAVTransportURIMetaData,
                PlayMedium: this.PlaybackStorageMedium,
                RecordMedium: this.RecordStorageMedium,
                WriteStatus: this.RecordMediumWriteStatus
            };
        },
        GetTransportInfo: function GetTransportInfo(InstanceID){
                    return {
                        CurrentTransportState: this.TransportState,
                        CurrentTransportStatus: this.TransportStatus,
                        CurrentSpeed: this.TransportPlaySpeed
                    };
                },
        GetPositionInfo: function GetPositionInfo(InstanceID){
            return {
                Track: this.CurrentTrack,
                TrackDuration: this.CurrentTrackDuration,
                TrackMetaData: this.CurrentTrackMetaData,
                TrackURI: this.CurrentTrackURI,
                RelTime: this.RelativeTimePosition,
                AbsTime: this.AbsoluteTimePosition,
                RelCount: this.RelativeCounterPosition,
                AbsCount: this.AbsoluteCounterPosition
            };
        },     
        GetDeviceCapabilities: function GetDeviceCapabilities(InstanceID){
            return {
                PlayMedia: this.PossiblePlaybackStorageMedia,
                RecMedia: this.PossibleRecordStorageMedia,
                RecQualityModes: this.PossibleRecordQualityModes
            }:
        },
        GetTransportSettings: function GetTransportSettings(InstanceID){
            return {
                PlayMode: this.CurrentPlayMode,
                RecQualityMode: this.CurrentRecordQualityMode
            };
        },
        Stop: function Stop(InstanceID){},
        Play: function Play(InstanceID, Speed){},
        Pause: function Pause(InstanceID){},
        Seek: function Seek(InstanceID, Unit, Target){},
        Next: function Next(InstanceID){},
        Previous: function Previous(InstanceID){},
        SetPlayMode: function SetPlayMode(InstanceID, NewPlayMode){},
        GetCurrentTransportActions: function GetCurrentTransportActions(InstanceID){ return Actions; },
        X_GetOperationList: function X_GetOperationList(AVTInstanceID){ return OperationList; },
        X_ExecuteOperation: function X_ExecuteOperation(AVTInstanceID, ActionDirective){ return Result; },

        LastChange: 'string', // sendEvents = true
        TransportState: 'string', // ['STOPPED', 'PLAYING', 'PAUSED_PLAYBACK', 'TRANSITIONING', 'NO_MEDIA_PRESENT' ] sendEvents = false
        TransportStatus: 'string', // [ 'OK', 'ERROR_OCCURRED' ] sendEvents = false
        PlaybackStorageMedium: 'string', // allowedvalue: 'NETWORK' sendEvents = false
        RecordStorageMedium: 'string', // allowedvalue: 'NOT_IMPLEMENTED' sendEvents = false
        PossiblePlaybackStorageMedia: 'string', // sendEvents = false
        PossibleRecordStorageMedia: 'string', // sendEvents = false
        CurrentPlayMode: 'string', // defaultvalue: 'NORMAL' allowedvalue: [ 'NORMAL', 'RANDOM', 'REPEAT_ONE', 'REPEAT_ALL' ] sendEvents = false
        TransportPlaySpeed: 'string', // allowedvalue: 1  sendEvents = false
        RecordMediumWriteStatus: 'string', // allowedvalue: 'NOT_IMPLEMENTED' sendEvents = false
        CurrentRecordQualityMode: 'string', //'allowedvalue': 'NOT_IMPLEMENTED' sendEvents = false
        NumberOfTracks: 'ui4', // allowedvaluerange: { 'minimum': 0, 'maximum': 1 } sendEvents = false
        CurrentTrack: 'ui4', // allowedvaluerange: { 'minimum': 0, 'maximum': 1, 'step': 1 } sendEvents = false
        A_ARG_TYPE_SeekMode: 'string', //[ 'TRACK_NR', 'REL_TIME' ]   sendEvents = false
        A_ARG_TYPE_SeekTarget: 'string', //sendEvents = false
        A_ARG_TYPE_InstanceID: 'ui4', //sendEvents = false
        X_A_ARG_TYPE_OperationList: 'string', //sendEvents = false
        X_A_ARG_TYPE_ActionDirective: 'string', //sendEvents = false
        X_A_ARG_TYPE_ROPResult: 'string', //sendEvents = false
        PossibleRecordQualityModes: 'string', //sendEvents = false
        CurrentTrackDuration: 'string', //sendEvents = false
        CurrentMediaDuration: 'string', //sendEvents = false
        CurrentTrackMetaData: 'string', //sendEvents = false
        CurrentTrackURI: 'string', //sendEvents = false
        AVTransportURI: 'string', //sendEvents = false
        AVTransportURIMetaData: 'string', //sendEvents = false
        NextAVTransportURI: 'string', //sendEvents = false
        NextAVTransportURIMetaData: 'string', //sendEvents = false
        RelativeTimePosition: 'string', //sendEvents = false
        AbsoluteTimePosition: 'string', //sendEvents = false
        RelativeCounterPosition: 'i4', //sendEvents = false
        AbsoluteCounterPosition: 'i4', //sendEvents = false
        CurrentTransportActions: 'string' //sendEvents = false
    },

    //urn:schemas-upnp-org:service:RenderingControl:1
    RenderingControl :{    
    version: '1.0',
    ListPresets: function ListPresets(InstanceID){ return CurrentPresetNameList;},
    SelectPreset: function SelectPreset(InstanceID, PresetName){},
    GetMute: function GetMute(InstanceID, Channel){ return CurrentMute; },
    SetMute: function SetMute(InstanceID, Channel, DesiredMute){},
    GetVolume: function GetVolume(InstanceID, Channel){ return CurrentVolume;},
    SetVolume: function SetVolume(InstanceID, Channel, DesiredVolume){},
    PresetNameList: 'string', // sendevents = false
    LastChange: 'string', // sendevents = true
    Mute: 'boolean', // sendevents = false
    Volume: 'ui2', // sendevents = false allowedvaluerange: { minimum: 0, maximum: 100, step: 1 },
    A_ARG_TYPE_InstanceID: 'ui4', // sendevents = false
    A_ARG_TYPE_Channel: 'string', // sendevents = false  allowedvalue: 'Master'
    A_ARG_TYPE_PresetName: 'string' // sendevents = false  allowedvalue: 'FactoryDefaults'
  }
}