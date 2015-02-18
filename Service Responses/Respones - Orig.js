var response = {
  'urn:schemas-upnp-org:service:Layer3Forwarding:1': {
    'scpdUrl': 'http://192.168.1.1:44417/L3F.xml',
    'name': 'Layer 3 Forwarding',
    'version': '1.0',
    'methods': {
      'action': [
        {
          'name': 'SetDefaultConnectionService',
          'argumentlist': {
            'argument': {
              'name': 'NewDefaultConnectionService',
              'direction': 'in',
              'relatedstatevariable': 'DefaultConnectionService'
            }
          }
        },
        {
          'name': 'GetDefaultConnectionService',
          'argumentlist': {
            'argument': {
              'name': 'NewDefaultConnectionService',
              'direction': 'out',
              'relatedstatevariable': 'DefaultConnectionService'
            }
          }
        }
      ]
    },
    'properties': {
      'statevariable': {
        'name': 'DefaultConnectionService',
        'datatype': 'string',
        '@sendevents': 'yes'
      }
    }
  },
  'urn:schemas-wifialliance-org:service:WFAWLANConfig:1': {
    'scpdUrl': 'http://192.168.1.1:1990/x_wfawlanconfig.xml',
    'name': 'WFA WLAN Config',
    'version': '1.0',
    'methods': {
      'action': [
        {
          'name': 'DelAPSettings',
          'argumentlist': {
            'argument': {
              'name': 'NewAPSettings',
              'direction': 'in',
              'relatedstatevariable': 'APSettings'
            }
          }
        },
        {
          'name': 'DelSTASettings',
          'argumentlist': {
            'argument': {
              'name': 'NewSTASettings',
              'direction': 'in',
              'relatedstatevariable': 'STASettings'
            }
          }
        },
        {
          'name': 'GetAPSettings',
          'argumentlist': {
            'argument': [
              {
                'name': 'NewMessage',
                'direction': 'in',
                'relatedstatevariable': 'Message'
              },
              {
                'name': 'NewAPSettings',
                'direction': 'out',
                'relatedstatevariable': 'APSettings'
              }
            ]
          }
        },
        {
          'name': 'GetDeviceInfo',
          'argumentlist': {
            'argument': {
              'name': 'NewDeviceInfo',
              'direction': 'out',
              'relatedstatevariable': 'DeviceInfo'
            }
          }
        },
        {
          'name': 'GetSTASettings',
          'argumentlist': {
            'argument': [
              {
                'name': 'NewMessage',
                'direction': 'in',
                'relatedstatevariable': 'Message'
              },
              {
                'name': 'NewSTASettings',
                'direction': 'out',
                'relatedstatevariable': 'STASettings'
              }
            ]
          }
        },
        {
          'name': 'PutMessage',
          'argumentlist': {
            'argument': [
              {
                'name': 'NewInMessage',
                'direction': 'in',
                'relatedstatevariable': 'InMessage'
              },
              {
                'name': 'NewOutMessage',
                'direction': 'out',
                'relatedstatevariable': 'OutMessage'
              }
            ]
          }
        },
        {
          'name': 'PutWLANResponse',
          'argumentlist': {
            'argument': [
              {
                'name': 'NewMessage',
                'direction': 'in',
                'relatedstatevariable': 'Message'
              },
              {
                'name': 'NewWLANEventType',
                'direction': 'in',
                'relatedstatevariable': 'WLANEventType'
              },
              {
                'name': 'NewWLANEventMAC',
                'direction': 'in',
                'relatedstatevariable': 'WLANEventMAC'
              }
            ]
          }
        },
        {
          'name': 'RebootAP',
          'argumentlist': {
            'argument': {
              'name': 'NewAPSettings',
              'direction': 'in',
              'relatedstatevariable': 'APSettings'
            }
          }
        },
        {
          'name': 'RebootSTA',
          'argumentlist': {
            'argument': {
              'name': 'NewSTASettings',
              'direction': 'in',
              'relatedstatevariable': 'APSettings'
            }
          }
        },
        {
          'name': 'ResetAP',
          'argumentlist': {
            'argument': {
              'name': 'NewMessage',
              'direction': 'in',
              'relatedstatevariable': 'Message'
            }
          }
        },
        {
          'name': 'ResetSTA',
          'argumentlist': {
            'argument': {
              'name': 'NewMessage',
              'direction': 'in',
              'relatedstatevariable': 'Message'
            }
          }
        },
        {
          'name': 'SetAPSettings',
          'argumentlist': {
            'argument': {
              'name': 'NewAPSettings',
              'direction': 'in',
              'relatedstatevariable': 'APSettings'
            }
          }
        },
        {
          'name': 'SetSelectedRegistrar',
          'argumentlist': {
            'argument': {
              'name': 'NewMessage',
              'direction': 'in',
              'relatedstatevariable': 'Message'
            }
          }
        },
        {
          'name': 'SetSTASettings',
          'argumentlist': {
            'argument': {
              'name': 'NewSTASettings',
              'direction': 'out',
              'relatedstatevariable': 'STASettings'
            }
          }
        }
      ]
    },
    'properties': {
      'statevariable': [
        {
          'name': 'WLANResponse',
          'datatype': 'bin.base64',
          '@sendevents': 'no'
        },
        {
          'name': 'WLANEventType',
          'datatype': 'ui1',
          '@sendevents': 'no'
        },
        {
          'name': 'InMessage',
          'datatype': 'bin.base64',
          '@sendevents': 'no'
        },
        {
          'name': 'OutMessage',
          'datatype': 'bin.base64',
          '@sendevents': 'no'
        },
        {
          'name': 'APSettings',
          'datatype': 'bin.base64',
          '@sendevents': 'no'
        },
        {
          'name': 'Message',
          'datatype': 'bin.base64',
          '@sendevents': 'no'
        },
        {
          'name': 'STAStatus',
          'datatype': 'ui1',
          '@sendevents': 'yes'
        },
        {
          'name': 'WLANEventMAC',
          'datatype': 'string',
          '@sendevents': 'no'
        },
        {
          'name': 'DeviceInfo',
          'datatype': 'bin.base64',
          '@sendevents': 'no'
        },
        {
          'name': 'STASettings',
          'datatype': 'bin.base64',
          '@sendevents': 'no'
        },
        {
          'name': 'APStatus',
          'datatype': 'ui1',
          '@sendevents': 'yes'
        },
        {
          'name': 'WLANEvent',
          'datatype': 'bin.base64',
          '@sendevents': 'yes'
        }
      ]
    }
  },
  'urn:microsoft.com:service:X_MS_MediaReceiverRegistrar:1': {
    'scpdUrl': 'http://192.168.1.2:2869/upnphost/udhisapi.dll?content=uuid:7816b1d4-30af-4c63-929a-42f8d33bebe1',
    'name': 'Media Receiver Registrar',
    'version': '1.0',
    'methods': {
      'action': [
        {
          'name': 'IsAuthorized',
          'argumentlist': {
            'argument': [
              {
                'name': 'DeviceID',
                'direction': 'in',
                'relatedstatevariable': 'A_ARG_TYPE_DeviceID'
              },
              {
                'name': 'Result',
                'direction': 'out',
                'relatedstatevariable': 'A_ARG_TYPE_Result'
              }
            ]
          }
        },
        {
          'name': 'RegisterDevice',
          'argumentlist': {
            'argument': [
              {
                'name': 'RegistrationReqMsg',
                'direction': 'in',
                'relatedstatevariable': 'A_ARG_TYPE_RegistrationReqMsg'
              },
              {
                'name': 'RegistrationRespMsg',
                'direction': 'out',
                'relatedstatevariable': 'A_ARG_TYPE_RegistrationRespMsg'
              }
            ]
          }
        },
        {
          'name': 'IsValidated',
          'argumentlist': {
            'argument': [
              {
                'name': 'DeviceID',
                'direction': 'in',
                'relatedstatevariable': 'A_ARG_TYPE_DeviceID'
              },
              {
                'name': 'Result',
                'direction': 'out',
                'relatedstatevariable': 'A_ARG_TYPE_Result'
              }
            ]
          }
        }
      ]
    },
    'properties': {
      'statevariable': [
        {
          'name': 'A_ARG_TYPE_DeviceID',
          'datatype': 'string',
          '@sendevents': 'no'
        },
        {
          'name': 'A_ARG_TYPE_Result',
          'datatype': 'int',
          '@sendevents': 'no'
        },
        {
          'name': 'A_ARG_TYPE_RegistrationReqMsg',
          'datatype': 'bin.base64',
          '@sendevents': 'no'
        },
        {
          'name': 'A_ARG_TYPE_RegistrationRespMsg',
          'datatype': 'bin.base64',
          '@sendevents': 'no'
        },
        {
          'name': 'AuthorizationGrantedUpdateID',
          'datatype': 'ui4',
          '@sendevents': 'yes'
        },
        {
          'name': 'AuthorizationDeniedUpdateID',
          'datatype': 'ui4',
          '@sendevents': 'yes'
        },
        {
          'name': 'ValidationSucceededUpdateID',
          'datatype': 'ui4',
          '@sendevents': 'yes'
        },
        {
          'name': 'ValidationRevokedUpdateID',
          'datatype': 'ui4',
          '@sendevents': 'yes'
        }
      ]
    }
  },
  'urn:schemas-upnp-org:service:ConnectionManager:1': {
    'scpdUrl': 'http://192.168.1.14:8080/ConnectionManager/desc.xml',
    'name': 'Connection Manager',
    'version': '1.0',
    'methods': {
      'action': [
        {
          'name': 'GetProtocolInfo',
          'argumentlist': {
            'argument': [
              {
                'name': 'Source',
                'direction': 'out',
                'relatedstatevariable': 'SourceProtocolInfo'
              },
              {
                'name': 'Sink',
                'direction': 'out',
                'relatedstatevariable': 'SinkProtocolInfo'
              }
            ]
          }
        },
        {
          'name': 'GetCurrentConnectionIDs',
          'argumentlist': {
            'argument': {
              'name': 'ConnectionIDs',
              'direction': 'out',
              'relatedstatevariable': 'CurrentConnectionIDs'
            }
          }
        },
        {
          'name': 'GetCurrentConnectionInfo',
          'argumentlist': {
            'argument': [
              {
                'name': 'ConnectionID',
                'direction': 'in',
                'relatedstatevariable': 'A_ARG_TYPE_ConnectionID'
              },
              {
                'name': 'RcsID',
                'direction': 'out',
                'relatedstatevariable': 'A_ARG_TYPE_RcsID'
              },
              {
                'name': 'AVTransportID',
                'direction': 'out',
                'relatedstatevariable': 'A_ARG_TYPE_AVTransportID'
              },
              {
                'name': 'ProtocolInfo',
                'direction': 'out',
                'relatedstatevariable': 'A_ARG_TYPE_ProtocolInfo'
              },
              {
                'name': 'PeerConnectionManager',
                'direction': 'out',
                'relatedstatevariable': 'A_ARG_TYPE_ConnectionManager'
              },
              {
                'name': 'PeerConnectionID',
                'direction': 'out',
                'relatedstatevariable': 'A_ARG_TYPE_ConnectionID'
              },
              {
                'name': 'Direction',
                'direction': 'out',
                'relatedstatevariable': 'A_ARG_TYPE_Direction'
              },
              {
                'name': 'Status',
                'direction': 'out',
                'relatedstatevariable': 'A_ARG_TYPE_ConnectionStatus'
              }
            ]
          }
        }
      ]
    },
    'properties': {
      'statevariable': [
        {
          'name': 'SourceProtocolInfo',
          'datatype': 'string',
          '@sendevents': 'yes'
        },
        {
          'name': 'SinkProtocolInfo',
          'datatype': 'string',
          '@sendevents': 'yes'
        },
        {
          'name': 'CurrentConnectionIDs',
          'datatype': 'string',
          '@sendevents': 'yes'
        },
        {
          'name': 'A_ARG_TYPE_ConnectionStatus',
          'datatype': 'string',
          'allowedvaluelist': {
            'allowedvalue': [
              'OK',
              'ContentFormatMismatch',
              'InsufficientBandwidth',
              'UnreliableChannel',
              'Unknown'
            ]
          },
          '@sendevents': 'no'
        },
        {
          'name': 'A_ARG_TYPE_ConnectionManager',
          'datatype': 'string',
          '@sendevents': 'no'
        },
        {
          'name': 'A_ARG_TYPE_Direction',
          'datatype': 'string',
          'allowedvaluelist': {
            'allowedvalue': [
              'Input',
              'Output'
            ]
          },
          '@sendevents': 'no'
        },
        {
          'name': 'A_ARG_TYPE_ProtocolInfo',
          'datatype': 'string',
          '@sendevents': 'no'
        },
        {
          'name': 'A_ARG_TYPE_ConnectionID',
          'datatype': 'i4',
          '@sendevents': 'no'
        },
        {
          'name': 'A_ARG_TYPE_AVTransportID',
          'datatype': 'i4',
          '@sendevents': 'no'
        },
        {
          'name': 'A_ARG_TYPE_RcsID',
          'datatype': 'i4',
          '@sendevents': 'no'
        }
      ]
    }
  },
  'urn:schemas-upnp-org:service:ContentDirectory:1': {
    'scpdUrl': 'http://192.168.1.2:2869/upnphost/udhisapi.dll?content=uuid:3f83f1ed-a3ed-4b20-9a7c-0be406197d6c',
    'name': 'Content Directory',
    'version': '1.0',
    'methods': {
      'action': [
        {
          'name': 'GetSearchCapabilities',
          'argumentlist': {
            'argument': {
              'name': 'SearchCaps',
              'direction': 'out',
              'relatedstatevariable': 'SearchCapabilities'
            }
          }
        },
        {
          'name': 'GetSortCapabilities',
          'argumentlist': {
            'argument': {
              'name': 'SortCaps',
              'direction': 'out',
              'relatedstatevariable': 'SortCapabilities'
            }
          }
        },
        {
          'name': 'GetSystemUpdateID',
          'argumentlist': {
            'argument': {
              'name': 'Id',
              'direction': 'out',
              'relatedstatevariable': 'SystemUpdateID'
            }
          }
        },
        {
          'name': 'Browse',
          'argumentlist': {
            'argument': [
              {
                'name': 'ObjectID',
                'direction': 'in',
                'relatedstatevariable': 'A_ARG_TYPE_ObjectID'
              },
              {
                'name': 'BrowseFlag',
                'direction': 'in',
                'relatedstatevariable': 'A_ARG_TYPE_BrowseFlag'
              },
              {
                'name': 'Filter',
                'direction': 'in',
                'relatedstatevariable': 'A_ARG_TYPE_Filter'
              },
              {
                'name': 'StartingIndex',
                'direction': 'in',
                'relatedstatevariable': 'A_ARG_TYPE_Index'
              },
              {
                'name': 'RequestedCount',
                'direction': 'in',
                'relatedstatevariable': 'A_ARG_TYPE_Count'
              },
              {
                'name': 'SortCriteria',
                'direction': 'in',
                'relatedstatevariable': 'A_ARG_TYPE_SortCriteria'
              },
              {
                'name': 'Result',
                'direction': 'out',
                'relatedstatevariable': 'A_ARG_TYPE_Result'
              },
              {
                'name': 'NumberReturned',
                'direction': 'out',
                'relatedstatevariable': 'A_ARG_TYPE_Count'
              },
              {
                'name': 'TotalMatches',
                'direction': 'out',
                'relatedstatevariable': 'A_ARG_TYPE_Count'
              },
              {
                'name': 'UpdateID',
                'direction': 'out',
                'relatedstatevariable': 'A_ARG_TYPE_UpdateID'
              }
            ]
          }
        },
        {
          'name': 'Search',
          'argumentlist': {
            'argument': [
              {
                'name': 'ContainerID',
                'direction': 'in',
                'relatedstatevariable': 'A_ARG_TYPE_ObjectID'
              },
              {
                'name': 'SearchCriteria',
                'direction': 'in',
                'relatedstatevariable': 'A_ARG_TYPE_SearchCriteria'
              },
              {
                'name': 'Filter',
                'direction': 'in',
                'relatedstatevariable': 'A_ARG_TYPE_Filter'
              },
              {
                'name': 'StartingIndex',
                'direction': 'in',
                'relatedstatevariable': 'A_ARG_TYPE_Index'
              },
              {
                'name': 'RequestedCount',
                'direction': 'in',
                'relatedstatevariable': 'A_ARG_TYPE_Count'
              },
              {
                'name': 'SortCriteria',
                'direction': 'in',
                'relatedstatevariable': 'A_ARG_TYPE_SortCriteria'
              },
              {
                'name': 'Result',
                'direction': 'out',
                'relatedstatevariable': 'A_ARG_TYPE_Result'
              },
              {
                'name': 'NumberReturned',
                'direction': 'out',
                'relatedstatevariable': 'A_ARG_TYPE_Count'
              },
              {
                'name': 'TotalMatches',
                'direction': 'out',
                'relatedstatevariable': 'A_ARG_TYPE_Count'
              },
              {
                'name': 'UpdateID',
                'direction': 'out',
                'relatedstatevariable': 'A_ARG_TYPE_UpdateID'
              }
            ]
          }
        },
        {
          'name': 'X_GetRemoteSharingStatus',
          'argumentlist': {
            'argument': {
              'name': 'Status',
              'direction': 'out',
              'relatedstatevariable': 'X_RemoteSharingEnabled'
            }
          }
        }
      ]
    },
    'properties': {
      'statevariable': [
        {
          'name': 'A_ARG_TYPE_ObjectID',
          'datatype': 'string',
          '@sendevents': 'no'
        },
        {
          'name': 'A_ARG_TYPE_Result',
          'datatype': 'string',
          '@sendevents': 'no'
        },
        {
          'name': 'A_ARG_TYPE_SearchCriteria',
          'datatype': 'string',
          '@sendevents': 'no'
        },
        {
          'name': 'A_ARG_TYPE_BrowseFlag',
          'datatype': 'string',
          'allowedvaluelist': {
            'allowedvalue': [
              'BrowseMetadata',
              'BrowseDirectChildren'
            ]
          },
          '@sendevents': 'no'
        },
        {
          'name': 'A_ARG_TYPE_Filter',
          'datatype': 'string',
          '@sendevents': 'no'
        },
        {
          'name': 'A_ARG_TYPE_SortCriteria',
          'datatype': 'string',
          '@sendevents': 'no'
        },
        {
          'name': 'A_ARG_TYPE_Index',
          'datatype': 'ui4',
          '@sendevents': 'no'
        },
        {
          'name': 'A_ARG_TYPE_Count',
          'datatype': 'ui4',
          '@sendevents': 'no'
        },
        {
          'name': 'A_ARG_TYPE_UpdateID',
          'datatype': 'ui4',
          '@sendevents': 'no'
        },
        {
          'name': 'SearchCapabilities',
          'datatype': 'string',
          '@sendevents': 'no'
        },
        {
          'name': 'SortCapabilities',
          'datatype': 'string',
          '@sendevents': 'no'
        },
        {
          'name': 'SystemUpdateID',
          'datatype': 'ui4',
          '@sendevents': 'yes'
        },
        {
          'name': 'ContainerUpdateIDs',
          'datatype': 'string',
          '@sendevents': 'yes'
        },
        {
          'name': 'X_RemoteSharingEnabled',
          'datatype': 'boolean',
          '@sendevents': 'yes'
        }
      ]
    }
  },
  'urn:schemas-upnp-org:service:RenderingControl:1': {
    'scpdUrl': 'http://192.168.1.14:8080/RenderingControl/desc.xml',
    'name': 'Rendering Control',
    'version': '1.0',
    'methods': {
      'action': [
        {
          'name': 'ListPresets',
          'argumentlist': {
            'argument': [
              {
                'name': 'InstanceID',
                'direction': 'in',
                'relatedstatevariable': 'A_ARG_TYPE_InstanceID'
              },
              {
                'name': 'CurrentPresetNameList',
                'direction': 'out',
                'relatedstatevariable': 'PresetNameList'
              }
            ]
          }
        },
        {
          'name': 'SelectPreset',
          'argumentlist': {
            'argument': [
              {
                'name': 'InstanceID',
                'direction': 'in',
                'relatedstatevariable': 'A_ARG_TYPE_InstanceID'
              },
              {
                'name': 'PresetName',
                'direction': 'in',
                'relatedstatevariable': 'A_ARG_TYPE_PresetName'
              }
            ]
          }
        },
        {
          'name': 'GetMute',
          'argumentlist': {
            'argument': [
              {
                'name': 'InstanceID',
                'direction': 'in',
                'relatedstatevariable': 'A_ARG_TYPE_InstanceID'
              },
              {
                'name': 'Channel',
                'direction': 'in',
                'relatedstatevariable': 'A_ARG_TYPE_Channel'
              },
              {
                'name': 'CurrentMute',
                'direction': 'out',
                'relatedstatevariable': 'Mute'
              }
            ]
          }
        },
        {
          'name': 'SetMute',
          'argumentlist': {
            'argument': [
              {
                'name': 'InstanceID',
                'direction': 'in',
                'relatedstatevariable': 'A_ARG_TYPE_InstanceID'
              },
              {
                'name': 'Channel',
                'direction': 'in',
                'relatedstatevariable': 'A_ARG_TYPE_Channel'
              },
              {
                'name': 'DesiredMute',
                'direction': 'in',
                'relatedstatevariable': 'Mute'
              }
            ]
          }
        },
        {
          'name': 'GetVolume',
          'argumentlist': {
            'argument': [
              {
                'name': 'InstanceID',
                'direction': 'in',
                'relatedstatevariable': 'A_ARG_TYPE_InstanceID'
              },
              {
                'name': 'Channel',
                'direction': 'in',
                'relatedstatevariable': 'A_ARG_TYPE_Channel'
              },
              {
                'name': 'CurrentVolume',
                'direction': 'out',
                'relatedstatevariable': 'Volume'
              }
            ]
          }
        },
        {
          'name': 'SetVolume',
          'argumentlist': {
            'argument': [
              {
                'name': 'InstanceID',
                'direction': 'in',
                'relatedstatevariable': 'A_ARG_TYPE_InstanceID'
              },
              {
                'name': 'Channel',
                'direction': 'in',
                'relatedstatevariable': 'A_ARG_TYPE_Channel'
              },
              {
                'name': 'DesiredVolume',
                'direction': 'in',
                'relatedstatevariable': 'Volume'
              }
            ]
          }
        }
      ]
    },
    'properties': {
      'statevariable': [
        {
          'name': 'PresetNameList',
          'datatype': 'string',
          '@sendevents': 'no'
        },
        {
          'name': 'LastChange',
          'datatype': 'string',
          '@sendevents': 'yes'
        },
        {
          'name': 'Mute',
          'datatype': 'boolean',
          '@sendevents': 'no'
        },
        {
          'name': 'Volume',
          'datatype': 'ui2',
          'allowedvaluerange': {
            'minimum': 0,
            'maximum': 100,
            'step': 1
          },
          '@sendevents': 'no'
        },
        {
          'name': 'A_ARG_TYPE_Channel',
          'datatype': 'string',
          'allowedvaluelist': {
            'allowedvalue': 'Master'
          },
          '@sendevents': 'no'
        },
        {
          'name': 'A_ARG_TYPE_InstanceID',
          'datatype': 'ui4',
          '@sendevents': 'no'
        },
        {
          'name': 'A_ARG_TYPE_PresetName',
          'datatype': 'string',
          'allowedvaluelist': {
            'allowedvalue': 'FactoryDefaults'
          },
          '@sendevents': 'no'
        }
      ]
    }
  },
  'urn:schemas-sony-com:service:IRCC:1': {
    'scpdUrl': 'http://192.168.1.14:8080/IRCCSCPD.xml',
    'name': 'IRCC',
    'version': '1.0',
    'methods': {
      'action': [
        {
          'name': 'X_SendIRCC',
          'argumentlist': {
            'argument': {
              'name': 'IRCCCode',
              'direction': 'in',
              'relatedstatevariable': 'X_A_ARG_TYPE_IRCCCode'
            }
          }
        },
        {
          'name': 'X_GetStatus',
          'argumentlist': {
            'argument': [
              {
                'name': 'CategoryCode',
                'direction': 'in',
                'relatedstatevariable': 'X_A_ARG_TYPE_CategoryCode'
              },
              {
                'name': 'CurrentStatus',
                'direction': 'out',
                'relatedstatevariable': 'X_A_ARG_TYPE_CurrentStatus'
              },
              {
                'name': 'CurrentCommandInfo',
                'direction': 'out',
                'relatedstatevariable': 'X_A_ARG_TYPE_CurrentCommandInfo'
              }
            ]
          }
        }
      ]
    },
    'properties': {
      'statevariable': [
        {
          'name': 'X_A_ARG_TYPE_CategoryCode',
          'datatype': 'string',
          '@sendevents': 'no'
        },
        {
          'name': 'X_A_ARG_TYPE_CurrentCommandInfo',
          'datatype': 'string',
          '@sendevents': 'no'
        },
        {
          'name': 'X_A_ARG_TYPE_CurrentStatus',
          'datatype': 'string',
          'allowedvaluelist': {
            'allowedvalue': [
              0,
              801,
              804,
              805,
              806
            ]
          },
          '@sendevents': 'no'
        },
        {
          'name': 'X_A_ARG_TYPE_IRCCCode',
          'datatype': 'string',
          '@sendevents': 'no'
        }
      ]
    }
  },
  'urn:schemas-sony-com:service:Party:1': {
    'scpdUrl': 'http://192.168.1.14:8080/Party_scpd.xml',
    'name': 'Party',
    'version': '1.0',
    'methods': {
      'action': [
        {
          'name': 'X_GetDeviceInfo',
          'argumentlist': {
            'argument': [
              {
                'name': 'SingerCapability',
                'direction': 'out',
                'relatedstatevariable': 'X_A_ARG_TYPE_SingerCapability'
              },
              {
                'name': 'TransportPort',
                'direction': 'out',
                'relatedstatevariable': 'X_A_ARG_TYPE_TransportPort'
              }
            ]
          }
        },
        {
          'name': 'X_GetState',
          'argumentlist': {
            'argument': [
              {
                'name': 'PartyState',
                'direction': 'out',
                'relatedstatevariable': 'X_PartyState'
              },
              {
                'name': 'PartyMode',
                'direction': 'out',
                'relatedstatevariable': 'X_PartyMode'
              },
              {
                'name': 'PartySong',
                'direction': 'out',
                'relatedstatevariable': 'X_PartySong'
              },
              {
                'name': 'SessionID',
                'direction': 'out',
                'relatedstatevariable': 'X_A_ARG_TYPE_SessionID'
              },
              {
                'name': 'NumberOfListeners',
                'direction': 'out',
                'relatedstatevariable': 'X_NumberOfListeners'
              },
              {
                'name': 'ListenerList',
                'direction': 'out',
                'relatedstatevariable': 'X_ListenerList'
              },
              {
                'name': 'SingerUUID',
                'direction': 'out',
                'relatedstatevariable': 'X_A_ARG_TYPE_UUID'
              },
              {
                'name': 'SingerSessionID',
                'direction': 'out',
                'relatedstatevariable': 'X_A_ARG_TYPE_SessionID'
              }
            ]
          }
        },
        {
          'name': 'X_Start',
          'argumentlist': {
            'argument': [
              {
                'name': 'PartyMode',
                'direction': 'in',
                'relatedstatevariable': 'X_PartyMode'
              },
              {
                'name': 'ListenerList',
                'direction': 'in',
                'relatedstatevariable': 'X_ListenerList'
              },
              {
                'name': 'SingerSessionID',
                'direction': 'out',
                'relatedstatevariable': 'X_A_ARG_TYPE_SessionID'
              }
            ]
          }
        },
        {
          'name': 'X_Entry',
          'argumentlist': {
            'argument': [
              {
                'name': 'SingerSessionID',
                'direction': 'in',
                'relatedstatevariable': 'X_A_ARG_TYPE_SessionID'
              },
              {
                'name': 'ListenerList',
                'direction': 'in',
                'relatedstatevariable': 'X_ListenerList'
              }
            ]
          }
        },
        {
          'name': 'X_Leave',
          'argumentlist': {
            'argument': [
              {
                'name': 'SingerSessionID',
                'direction': 'in',
                'relatedstatevariable': 'X_A_ARG_TYPE_SessionID'
              },
              {
                'name': 'ListenerList',
                'direction': 'in',
                'relatedstatevariable': 'X_ListenerList'
              }
            ]
          }
        },
        {
          'name': 'X_Abort',
          'argumentlist': {
            'argument': {
              'name': 'SingerSessionID',
              'direction': 'in',
              'relatedstatevariable': 'X_A_ARG_TYPE_SessionID'
            }
          }
        },
        {
          'name': 'X_Invite',
          'argumentlist': {
            'argument': [
              {
                'name': 'PartyMode',
                'direction': 'in',
                'relatedstatevariable': 'X_PartyMode'
              },
              {
                'name': 'SingerUUID',
                'direction': 'in',
                'relatedstatevariable': 'X_A_ARG_TYPE_UUID'
              },
              {
                'name': 'SingerSessionID',
                'direction': 'in',
                'relatedstatevariable': 'X_A_ARG_TYPE_SessionID'
              },
              {
                'name': 'ListenerSessionID',
                'direction': 'out',
                'relatedstatevariable': 'X_A_ARG_TYPE_SessionID'
              }
            ]
          }
        },
        {
          'name': 'X_Exit',
          'argumentlist': {
            'argument': {
              'name': 'ListenerSessionID',
              'direction': 'in',
              'relatedstatevariable': 'X_A_ARG_TYPE_SessionID'
            }
          }
        }
      ]
    },
    'properties': {
      'statevariable': [
        {
          'name': 'X_A_ARG_TYPE_SingerCapability',
          'datatype': 'ui1',
          '@sendevents': 'no'
        },
        {
          'name': 'X_A_ARG_TYPE_TransportPort',
          'datatype': 'ui2',
          '@sendevents': 'no'
        },
        {
          'name': 'X_PartyState',
          'datatype': 'string',
          '@sendevents': 'yes'
        },
        {
          'name': 'X_PartyMode',
          'datatype': 'string',
          '@sendevents': 'no'
        },
        {
          'name': 'X_PartySong',
          'datatype': 'string',
          '@sendevents': 'no'
        },
        {
          'name': 'X_A_ARG_TYPE_SessionID',
          'datatype': 'ui4',
          '@sendevents': 'no'
        },
        {
          'name': 'X_NumberOfListeners',
          'datatype': 'ui1',
          '@sendevents': 'yes'
        },
        {
          'name': 'X_ListenerList',
          'datatype': 'string',
          '@sendevents': 'no'
        },
        {
          'name': 'X_A_ARG_TYPE_UUID',
          'datatype': 'string',
          '@sendevents': 'no'
        }
      ]
    }
  },
  'urn:schemas-upnp-org:service:AVTransport:1': {
    'scpdUrl': 'http://192.168.1.14:8080/AVTransport/desc.xml',
    'name': 'AV Transport',
    'version': '1.0',
    'methods': {
      'action': [
        {
          'name': 'SetAVTransportURI',
          'argumentlist': {
            'argument': [
              {
                'name': 'InstanceID',
                'direction': 'in',
                'relatedstatevariable': 'A_ARG_TYPE_InstanceID'
              },
              {
                'name': 'CurrentURI',
                'direction': 'in',
                'relatedstatevariable': 'AVTransportURI'
              },
              {
                'name': 'CurrentURIMetaData',
                'direction': 'in',
                'relatedstatevariable': 'AVTransportURIMetaData'
              }
            ]
          }
        },
        {
          'name': 'SetNextAVTransportURI',
          'argumentlist': {
            'argument': [
              {
                'name': 'InstanceID',
                'direction': 'in',
                'relatedstatevariable': 'A_ARG_TYPE_InstanceID'
              },
              {
                'name': 'NextURI',
                'direction': 'in',
                'relatedstatevariable': 'NextAVTransportURI'
              },
              {
                'name': 'NextURIMetaData',
                'direction': 'in',
                'relatedstatevariable': 'NextAVTransportURIMetaData'
              }
            ]
          }
        },
        {
          'name': 'GetMediaInfo',
          'argumentlist': {
            'argument': [
              {
                'name': 'InstanceID',
                'direction': 'in',
                'relatedstatevariable': 'A_ARG_TYPE_InstanceID'
              },
              {
                'name': 'NrTracks',
                'direction': 'out',
                'relatedstatevariable': 'NumberOfTracks'
              },
              {
                'name': 'MediaDuration',
                'direction': 'out',
                'relatedstatevariable': 'CurrentMediaDuration'
              },
              {
                'name': 'CurrentURI',
                'direction': 'out',
                'relatedstatevariable': 'AVTransportURI'
              },
              {
                'name': 'CurrentURIMetaData',
                'direction': 'out',
                'relatedstatevariable': 'AVTransportURIMetaData'
              },
              {
                'name': 'NextURI',
                'direction': 'out',
                'relatedstatevariable': 'NextAVTransportURI'
              },
              {
                'name': 'NextURIMetaData',
                'direction': 'out',
                'relatedstatevariable': 'NextAVTransportURIMetaData'
              },
              {
                'name': 'PlayMedium',
                'direction': 'out',
                'relatedstatevariable': 'PlaybackStorageMedium'
              },
              {
                'name': 'RecordMedium',
                'direction': 'out',
                'relatedstatevariable': 'RecordStorageMedium'
              },
              {
                'name': 'WriteStatus',
                'direction': 'out',
                'relatedstatevariable': 'RecordMediumWriteStatus'
              }
            ]
          }
        },
        {
          'name': 'GetTransportInfo',
          'argumentlist': {
            'argument': [
              {
                'name': 'InstanceID',
                'direction': 'in',
                'relatedstatevariable': 'A_ARG_TYPE_InstanceID'
              },
              {
                'name': 'CurrentTransportState',
                'direction': 'out',
                'relatedstatevariable': 'TransportState'
              },
              {
                'name': 'CurrentTransportStatus',
                'direction': 'out',
                'relatedstatevariable': 'TransportStatus'
              },
              {
                'name': 'CurrentSpeed',
                'direction': 'out',
                'relatedstatevariable': 'TransportPlaySpeed'
              }
            ]
          }
        },
        {
          'name': 'GetPositionInfo',
          'argumentlist': {
            'argument': [
              {
                'name': 'InstanceID',
                'direction': 'in',
                'relatedstatevariable': 'A_ARG_TYPE_InstanceID'
              },
              {
                'name': 'Track',
                'direction': 'out',
                'relatedstatevariable': 'CurrentTrack'
              },
              {
                'name': 'TrackDuration',
                'direction': 'out',
                'relatedstatevariable': 'CurrentTrackDuration'
              },
              {
                'name': 'TrackMetaData',
                'direction': 'out',
                'relatedstatevariable': 'CurrentTrackMetaData'
              },
              {
                'name': 'TrackURI',
                'direction': 'out',
                'relatedstatevariable': 'CurrentTrackURI'
              },
              {
                'name': 'RelTime',
                'direction': 'out',
                'relatedstatevariable': 'RelativeTimePosition'
              },
              {
                'name': 'AbsTime',
                'direction': 'out',
                'relatedstatevariable': 'AbsoluteTimePosition'
              },
              {
                'name': 'RelCount',
                'direction': 'out',
                'relatedstatevariable': 'RelativeCounterPosition'
              },
              {
                'name': 'AbsCount',
                'direction': 'out',
                'relatedstatevariable': 'AbsoluteCounterPosition'
              }
            ]
          }
        },
        {
          'name': 'GetDeviceCapabilities',
          'argumentlist': {
            'argument': [
              {
                'name': 'InstanceID',
                'direction': 'in',
                'relatedstatevariable': 'A_ARG_TYPE_InstanceID'
              },
              {
                'name': 'PlayMedia',
                'direction': 'out',
                'relatedstatevariable': 'PossiblePlaybackStorageMedia'
              },
              {
                'name': 'RecMedia',
                'direction': 'out',
                'relatedstatevariable': 'PossibleRecordStorageMedia'
              },
              {
                'name': 'RecQualityModes',
                'direction': 'out',
                'relatedstatevariable': 'PossibleRecordQualityModes'
              }
            ]
          }
        },
        {
          'name': 'GetTransportSettings',
          'argumentlist': {
            'argument': [
              {
                'name': 'InstanceID',
                'direction': 'in',
                'relatedstatevariable': 'A_ARG_TYPE_InstanceID'
              },
              {
                'name': 'PlayMode',
                'direction': 'out',
                'relatedstatevariable': 'CurrentPlayMode'
              },
              {
                'name': 'RecQualityMode',
                'direction': 'out',
                'relatedstatevariable': 'CurrentRecordQualityMode'
              }
            ]
          }
        },
        {
          'name': 'Stop',
          'argumentlist': {
            'argument': {
              'name': 'InstanceID',
              'direction': 'in',
              'relatedstatevariable': 'A_ARG_TYPE_InstanceID'
            }
          }
        },
        {
          'name': 'Play',
          'argumentlist': {
            'argument': [
              {
                'name': 'InstanceID',
                'direction': 'in',
                'relatedstatevariable': 'A_ARG_TYPE_InstanceID'
              },
              {
                'name': 'Speed',
                'direction': 'in',
                'relatedstatevariable': 'TransportPlaySpeed'
              }
            ]
          }
        },
        {
          'name': 'Pause',
          'argumentlist': {
            'argument': {
              'name': 'InstanceID',
              'direction': 'in',
              'relatedstatevariable': 'A_ARG_TYPE_InstanceID'
            }
          }
        },
        {
          'name': 'Seek',
          'argumentlist': {
            'argument': [
              {
                'name': 'InstanceID',
                'direction': 'in',
                'relatedstatevariable': 'A_ARG_TYPE_InstanceID'
              },
              {
                'name': 'Unit',
                'direction': 'in',
                'relatedstatevariable': 'A_ARG_TYPE_SeekMode'
              },
              {
                'name': 'Target',
                'direction': 'in',
                'relatedstatevariable': 'A_ARG_TYPE_SeekTarget'
              }
            ]
          }
        },
        {
          'name': 'Next',
          'argumentlist': {
            'argument': {
              'name': 'InstanceID',
              'direction': 'in',
              'relatedstatevariable': 'A_ARG_TYPE_InstanceID'
            }
          }
        },
        {
          'name': 'Previous',
          'argumentlist': {
            'argument': {
              'name': 'InstanceID',
              'direction': 'in',
              'relatedstatevariable': 'A_ARG_TYPE_InstanceID'
            }
          }
        },
        {
          'name': 'SetPlayMode',
          'argumentlist': {
            'argument': [
              {
                'name': 'InstanceID',
                'direction': 'in',
                'relatedstatevariable': 'A_ARG_TYPE_InstanceID'
              },
              {
                'name': 'NewPlayMode',
                'direction': 'in',
                'relatedstatevariable': 'CurrentPlayMode'
              }
            ]
          }
        },
        {
          'name': 'GetCurrentTransportActions',
          'argumentlist': {
            'argument': [
              {
                'name': 'InstanceID',
                'direction': 'in',
                'relatedstatevariable': 'A_ARG_TYPE_InstanceID'
              },
              {
                'name': 'Actions',
                'direction': 'out',
                'relatedstatevariable': 'CurrentTransportActions'
              }
            ]
          }
        },
        {
          'name': 'X_GetOperationList',
          'argumentlist': {
            'argument': [
              {
                'name': 'AVTInstanceID',
                'direction': 'in',
                'relatedstatevariable': 'A_ARG_TYPE_InstanceID'
              },
              {
                'name': 'OperationList',
                'direction': 'out',
                'relatedstatevariable': 'X_A_ARG_TYPE_OperationList'
              }
            ]
          }
        },
        {
          'name': 'X_ExecuteOperation',
          'argumentlist': {
            'argument': [
              {
                'name': 'AVTInstanceID',
                'direction': 'in',
                'relatedstatevariable': 'A_ARG_TYPE_InstanceID'
              },
              {
                'name': 'ActionDirective',
                'direction': 'in',
                'relatedstatevariable': 'X_A_ARG_TYPE_ActionDirective'
              },
              {
                'name': 'Result',
                'direction': 'out',
                'relatedstatevariable': 'X_A_ARG_TYPE_ROPResult'
              }
            ]
          }
        }
      ]
    },
    'properties': {
      'statevariable': [
        {
          'name': 'LastChange',
          'datatype': 'string',
          '@sendevents': 'yes'
        },
        {
          'name': 'TransportState',
          'datatype': 'string',
          'allowedvaluelist': {
            'allowedvalue': [
              'STOPPED',
              'PLAYING',
              'PAUSED_PLAYBACK',
              'TRANSITIONING',
              'NO_MEDIA_PRESENT'
            ]
          },
          '@sendevents': 'no'
        },
        {
          'name': 'TransportStatus',
          'datatype': 'string',
          'allowedvaluelist': {
            'allowedvalue': [
              'OK',
              'ERROR_OCCURRED'
            ]
          },
          '@sendevents': 'no'
        },
        {
          'name': 'PlaybackStorageMedium',
          'datatype': 'string',
          'allowedvaluelist': {
            'allowedvalue': 'NETWORK'
          },
          '@sendevents': 'no'
        },
        {
          'name': 'RecordStorageMedium',
          'datatype': 'string',
          'allowedvaluelist': {
            'allowedvalue': 'NOT_IMPLEMENTED'
          },
          '@sendevents': 'no'
        },
        {
          'name': 'PossiblePlaybackStorageMedia',
          'datatype': 'string',
          '@sendevents': 'no'
        },
        {
          'name': 'PossibleRecordStorageMedia',
          'datatype': 'string',
          '@sendevents': 'no'
        },
        {
          'name': 'CurrentPlayMode',
          'datatype': 'string',
          'defaultvalue': 'NORMAL',
          'allowedvaluelist': {
            'allowedvalue': [
              'NORMAL',
              'RANDOM',
              'REPEAT_ONE',
              'REPEAT_ALL'
            ]
          },
          '@sendevents': 'no'
        },
        {
          'name': 'TransportPlaySpeed',
          'datatype': 'string',
          'allowedvaluelist': {
            'allowedvalue': 1
          },
          '@sendevents': 'no'
        },
        {
          'name': 'RecordMediumWriteStatus',
          'datatype': 'string',
          'allowedvaluelist': {
            'allowedvalue': 'NOT_IMPLEMENTED'
          },
          '@sendevents': 'no'
        },
        {
          'name': 'CurrentRecordQualityMode',
          'datatype': 'string',
          'allowedvaluelist': {
            'allowedvalue': 'NOT_IMPLEMENTED'
          },
          '@sendevents': 'no'
        },
        {
          'name': 'PossibleRecordQualityModes',
          'datatype': 'string',
          '@sendevents': 'no'
        },
        {
          'name': 'NumberOfTracks',
          'datatype': 'ui4',
          'allowedvaluerange': {
            'minimum': 0,
            'maximum': 1
          },
          '@sendevents': 'no'
        },
        {
          'name': 'CurrentTrack',
          'datatype': 'ui4',
          'allowedvaluerange': {
            'minimum': 0,
            'maximum': 1,
            'step': 1
          },
          '@sendevents': 'no'
        },
        {
          'name': 'CurrentTrackDuration',
          'datatype': 'string',
          '@sendevents': 'no'
        },
        {
          'name': 'CurrentMediaDuration',
          'datatype': 'string',
          '@sendevents': 'no'
        },
        {
          'name': 'CurrentTrackMetaData',
          'datatype': 'string',
          '@sendevents': 'no'
        },
        {
          'name': 'CurrentTrackURI',
          'datatype': 'string',
          '@sendevents': 'no'
        },
        {
          'name': 'AVTransportURI',
          'datatype': 'string',
          '@sendevents': 'no'
        },
        {
          'name': 'AVTransportURIMetaData',
          'datatype': 'string',
          '@sendevents': 'no'
        },
        {
          'name': 'NextAVTransportURI',
          'datatype': 'string',
          '@sendevents': 'no'
        },
        {
          'name': 'NextAVTransportURIMetaData',
          'datatype': 'string',
          '@sendevents': 'no'
        },
        {
          'name': 'RelativeTimePosition',
          'datatype': 'string',
          '@sendevents': 'no'
        },
        {
          'name': 'AbsoluteTimePosition',
          'datatype': 'string',
          '@sendevents': 'no'
        },
        {
          'name': 'RelativeCounterPosition',
          'datatype': 'i4',
          '@sendevents': 'no'
        },
        {
          'name': 'AbsoluteCounterPosition',
          'datatype': 'i4',
          '@sendevents': 'no'
        },
        {
          'name': 'CurrentTransportActions',
          'datatype': 'string',
          '@sendevents': 'no'
        },
        {
          'name': 'A_ARG_TYPE_SeekMode',
          'datatype': 'string',
          'allowedvaluelist': {
            'allowedvalue': [
              'TRACK_NR',
              'REL_TIME'
            ]
          },
          '@sendevents': 'no'
        },
        {
          'name': 'A_ARG_TYPE_SeekTarget',
          'datatype': 'string',
          '@sendevents': 'no'
        },
        {
          'name': 'A_ARG_TYPE_InstanceID',
          'datatype': 'ui4',
          '@sendevents': 'no'
        },
        {
          'name': 'X_A_ARG_TYPE_OperationList',
          'datatype': 'string',
          '@sendevents': 'no'
        },
        {
          'name': 'X_A_ARG_TYPE_ActionDirective',
          'datatype': 'string',
          '@sendevents': 'no'
        },
        {
          'name': 'X_A_ARG_TYPE_ROPResult',
          'datatype': 'string',
          '@sendevents': 'no'
        }
      ]
    }
  }
};