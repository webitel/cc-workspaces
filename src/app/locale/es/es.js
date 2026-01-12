import {
  AgentStatus,
  DeviceNotAllowPermissionError,
  DeviceNotFoundError,
  JobState,
  LicencePermissionError,
} from 'webitel-sdk';

export default {
  reusable: {
    answer: 'Responder',
    reject: 'Rechazar',
    accept: 'Aceptar',
    decline: 'Declinar',
    send: 'Enviar',
    save: 'Guardar',
    cancel: 'Cancelar',
    close: 'Cerrar',
    logout: 'Cerrar sesión',
    search: 'Buscar',
    description: 'Descripción',
    settings: 'Configuración',
    edit: 'Editar',
    select: 'Seleccionar',
    run: 'Ejecutar',
    today: 'Hoy',
    phoneNumber: 'Número de teléfono',
    unknownTaskSize: 'Tamaño de tarea desconocido',
  },
  feedback: {
    success: {
      title: '¡Gracias!',
      description: 'Hemos guardado tu respuesta correctamente',
    },
    error: {
      title: '¡Vaya!',
      description: 'Algo salió mal',
    },
  },
  appNavigator: {
    title: 'Aplicaciones de Webitel',
    admin: 'Administrador',
    agent: 'Espacio de trabajo del agente',
    supervisor: 'Espacio de trabajo del supervisor',
    audit: 'Auditoría',
    history: 'Historial de llamadas',
    grafana: 'Grafana',
  },
  header: {
    docs: 'Documentos',
    enableVideo: 'Habilitar video',
    dnd: {
      label: 'No molestar',
      tooltip: 'Solo recibirá llamadas de colas',
    },
  },
  widgets: {
    callInbound: 'Llamadas entrantes',
    callInboundQueue: 'Llamadas de cola entrante',
    callDialerQueue: 'Todas las llamadas del marcador',
    callManual: 'Llamadas manuales',
    callHandled: 'Llamadas procesadas',
    callMissed: 'Llamadas perdidas',
    callQueueMissed: 'Perdidas de colas',
    avgTalk: 'Tiempo promedio de conversación',
    avgHold: 'Tiempo promedio de espera',
    utilization: 'Utilización',
    occupancy: 'Ocupación',
    chatAccepts: 'Chats aceptados',
    chatAht: 'Tiempo de manejo de chat',
    scoreCount: 'Llamadas calificadas',
    scoreAvg: 'Puntuación total',
    sumTalk: 'Tiempo total de conversación',
    processing: 'Tiempo de trabajo después de la llamada',
    available: 'Disponible',
    voiceMail: 'Tiempo total de buzón de voz',
    queueTalk: 'Tiempo de conversación en cola',
    taskAccepts: 'Cantidad de tareas',
  },
  queueSec: {
    call: {
      call: 'Llamada | Llamadas',
      preview: {
        md: {
          active: 'Llamadas activas',
          missed: 'Llamadas perdidas',
          offline: 'Llamadas fuera de línea',
          manual: 'Llamadas autoasignadas',
        },
        sm: {
          active: 'Activas',
          missed: 'Perdidas',
          offline: 'Fuera de línea',
          manual: 'Autoasignadas',
        },
      },
    },
    chat: {
      chats: 'Chat | Chats',
      preview: {
        md: {
          active: 'Chats activos',
          manual: 'Chats autoasignados',
          closed: 'Chats cerrados',
        },
        sm: {
          active: 'Activos',
          manual: 'Autoasignados',
          closed: 'Cerrados',
        },
      },
    },
    job: {
      jobs: 'Tarea | Tareas',
      preview: {
        md: {
          active: 'Tareas activas',
        },
        sm: {
          active: 'Activas',
        },
      },
    },
  },
  infoSec: {
    generalInfo: {
      generalInfo: 'Información general',
      queueWaiting: 'En espera',
      queue: 'Cola | Colas',
      agents: 'Agentes',
      total: 'Total',
      pauses: 'Pausas',
      free: 'Libre',
      score: 'Puntuación del agente',
    },
    clientInfo: 'Información del cliente',
    memberDescription: 'Descripción del miembro',
    variables: 'Variables',
    contacts: {
      client: 'Cliente',
      manager: 'Propietario',
      attributes: 'Atributo | Atributos',
      emptyContact: 'No se encontró contacto',
      emptyLabels: 'No hay etiquetas',
      emptyAttributes: 'No hay atributos',
      emptyDescription: 'No hay descripción',
      foundOneContact: '{ count } contacto encontrado',
      foundSomeContact: '{ current } de { count } contactos',
      communications: 'Opciones de comunicación',
      destination: 'Destino',
      searchPlaceholder: 'Ingrese criterios de búsqueda',
    },
    knowledgeBase: 'Base de conocimientos',
    processing: {
      title: 'Procesamiento de tareas',
      reporting: {
        isSuccess: '¿Fue exitosa esta tarea?',
        yes: 'Sí',
        no: 'No',
        nextDistributeAtTitle: '¿Programar próxima tarea?',
        nextDistributeAt: 'Hora de la próxima tarea',
      },
      form: {
        formFile: {
          deleteConfirmation:
            '¿Está seguro de que desea eliminar este archivo?',
          empty: 'Aún no hay archivos',
        },
        formTable: {
          title: 'Tabla',
          error:
            'Su tabla de datos tiene un formato no válido. Por favor, revise su flujo.',
        },
      },
    },
    flows: {
      dummy: 'Aún no se han configurado esquemas',
      runFlowSuccess: 'Esquema lanzado con éxito',
      runFlowError: 'Error al ejecutar el esquema',
    },
  },
  workspaceSec: {
    callState: {
      ringing: 'Llamando',
      inCall: 'En llamada',
      onHold: 'En espera',
      hangup: 'Colgar',
    },
    chat: {
      acceptPreviewText:
        'Si está listo para responder, haga clic primero en el botón "Aceptar"',
      draftPlaceholder: 'Escriba un mensaje...',
      dropzone: {
        title: 'Suelte sus archivos aquí',
        description: 'Para subirlos',
      },
      confirmClose: '¿Está seguro de que desea cerrar el chat activo?',
      closedСhat: 'El chat fue cerrado',
      chatStarted: 'Chat iniciado',
      chatEnded: 'Chat finalizado',
      chatTransferred: 'Chat transferido',
      chatsAgent: '{ agentName } se ha unido al chat',
      chatsAgentsList: '{ agentName } participó en el chat',
      chatsFileBlocked: 'Archivo en cuarentena o bloqueado',
      errors: {
        uploadFileLimitSize: 'Se superó el límite de tamaño de archivo',
      },
    },
  },
  emptyWorkspace: {
    empty: {
      heading: 'Actualmente no hay llamadas ni chats',
      text: '¡Por favor espere! ¡Que tenga un buen trabajo!',
    },
    transfer: {
      heading: '¡Gracias!',
      text: 'La tarea ha sido transferida a otro operador',
    },
  },
  emptySearch: {
    heading: '¡Ups!',
    text: 'La búsqueda no ha dado ningún resultado',
  },
  bridge: {
    activeCalls: 'Llamadas activas',
    bridge: 'Puente',
  },
  history: {
    today: 'Hoy',
    yesterday: 'Ayer',
    openInHistory: 'Abrir en Historial',
  },
  transfer: {
    selectAgent: 'Por favor seleccione un agente',
    transfer: 'Transferir',
  },
  contacts: {
    phones: 'Teléfono | Teléfonos',
    emails: 'Correo electrónico | Correos electrónicos',
  },
  agentStatus: {
    callCenter: 'Centro de llamadas',
    breakPopup: {
      breakReason: 'Motivo de la pausa',
      commons: {
        coffeeBreak: 'Pausa para café',
        smokeBreak: 'Pausa para fumar',
        restroom: 'Baño',
        dinner: 'Cena',
        meeting: 'Reunión',
      },
    },
    breakTimer: {
      heading: 'Ahora está en modo {mode}',
      mode: {
        [AgentStatus.Pause]: 'pausa',
        [AgentStatus.BreakOut]: 'descanso',
      },
      [AgentStatus.BreakOut]: 'Descanso',
      continueWork: 'Continuar trabajo',
    },
  },
  disconnectPopup: {
    title: '¡Oh.. Algo salió mal!',
    mainText: 'La conexión se interrumpió accidentalmente.',
    reloadBtn: 'Recargar página',
  },
  welcomePopup: {
    title: '¡Bienvenido al Espacio de trabajo del agente de Webitel!',
    subtitle:
      'Por favor, verifique sus dispositivos y permisos del navegador antes de comenzar',
    mic: {
      status: 'Estado del permiso del micrófono',
      message: {
        notFound: 'Micrófono no encontrado',
        denied: 'Permiso denegado',
      },
    },
    notifications: {
      status: 'Estado del permiso de notificaciones',
      message: {
        denied: 'Permiso denegado',
      },
    },
    camera: {
      status: 'Estado del permiso de cámara',
      message: {
        denied: 'Permiso denegado',
      },
    },
  },
  descTrackAuthPopup: {
    title: 'Atención',
    errorLabel: 'No puedes trabajar en Workspace',
    errorDescription: 'DeskTrack no está en ejecución, o no has iniciado sesión',
    successLabel: 'DeskTrack se inició con éxito',
    successDescription: 'Puedes trabajar en Workspace',
  },
  error: {
    general: 'Ocurrió un error. Por favor, inténtelo de nuevo.',
    websocket: {
      [DeviceNotFoundError.id]:
        'El micrófono no está conectado. No se puede realizar la acción.',
      [DeviceNotAllowPermissionError.id]:
        'El acceso al micrófono está denegado. No se puede realizar la acción.',
      [LicencePermissionError.id.replaceAll('.', '_')]:
        'No puede trabajar en el Espacio de trabajo porque su licencia ha expirado.',
    },
    endpoint: {
      noLicense:
        'No puede trabajar en el Espacio de trabajo porque su licencia ha expirado.',
    },
  },
  notifications: {
    message: 'Nuevo mensaje de {name}',
    userInvite: 'Nueva invitación de chat de {name}',
    closeConversation: '{name} abandonó el chat',
    [JobState.Distribute]: 'Nueva tarea: {name}',
    newCall: 'Nueva llamada',
    closedChatError: 'Error al cargar chats cerrados',
  },
  emojiPicker: {
    categoriesLabel: 'Categorías',
    emojiUnsupportedMessage: 'Su navegador no admite emojis de color.',
    favoritesLabel: 'Favoritos',
    loadingMessage: 'Cargando…',
    networkErrorMessage: 'No se pudieron cargar los emojis.',
    regionLabel: 'Selector de emojis',
    searchDescription:
      'Cuando los resultados de búsqueda estén disponibles, presione arriba o abajo para seleccionar y enter para elegir.',
    searchLabel: 'Buscar',
    searchResultsLabel: 'Resultados de búsqueda',
    skinToneDescription:
      'Cuando se expande, presione arriba o abajo para seleccionar y enter para elegir.',
    skinToneLabel: 'Elija un tono de piel',
    skinTonesLabel: 'Tonos de piel',
    skinTones: [
      'Predeterminado',
      'Claro',
      'Medio-Claro',
      'Medio',
      'Medio-Oscuro',
      'Oscuro',
    ],
    categories: {
      custom: 'Personalizado',
      'smileys-emotion': 'Emoticonos y emociones',
      'people-body': 'Personas y cuerpo',
      'animals-nature': 'Animales y naturaleza',
      'food-drink': 'Comida y bebida',
      'travel-places': 'Viajes y lugares',
      activities: 'Actividades',
      objects: 'Objetos',
      symbols: 'Símbolos',
      flags: 'Banderas',
    },
  },
  confirmationPopup: {
    title: 'Confirmar acción',
  },
  autocompleteList: {
    quickReplies: ({ linked }) =>
      `/${linked('objects.quickReplies.quickReplies', 1).toLowerCase()}`,
    quickRepliesDescription:
      'Abre un menú de respuestas rápidas preestablecidas para respuestas de chat',
  },
};
