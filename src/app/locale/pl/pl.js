import {
	AgentStatus,
	DeviceNotAllowPermissionError,
	DeviceNotFoundError,
	JobState,
	LicencePermissionError,
} from 'webitel-sdk';

export default {
	reusable: {
		answer: 'Odpowiedz',
		reject: 'Odrzuć',
		accept: 'Akceptuj',
		decline: 'Odrzuć',
		send: 'Wyślij',
		save: 'Zapisz',
		cancel: 'Anuluj',
		close: 'Zamknij',
		logout: 'Wyloguj się',
		search: 'Szukaj',
		description: 'Opis',
		settings: 'Ustawienia',
		edit: 'Edytuj',
		select: 'Wybierz',
		run: 'Uruchom',
		today: 'Dzisiaj',
		phoneNumber: 'Numer telefonu',
		unknownTaskSize: 'Nieznany rozmiar zadania',
	},
	feedback: {
		success: {
			title: 'Dziękujemy!',
			description: 'Twoja odpowiedź została pomyślnie zapisana',
		},
		error: {
			title: 'Ups!',
			description: 'Coś poszło nie tak',
		},
	},
	appNavigator: {
		title: 'Aplikacje Webitel',
		admin: 'Admin',
		agent: 'Agent Workspace',
		supervisor: 'Supervisor Workspace',
		audit: 'Audyt',
		history: 'Historia połączeń',
		grafana: 'Grafana',
	},
	header: {
		docs: 'Dokumentacja',
		enableVideo: 'Włącz wideo',
		dnd: {
			label: 'Nie przeszkadzać',
			tooltip: 'Będziesz otrzymywać połączenia tylko z kolejek',
		},
	},
	widgets: {
		callInbound: 'Połączenia przychodzące',
		callInboundQueue: 'Połączenia z kolejki przychodzącej',
		callDialerQueue: 'Wszystkie połączenia z dialera',
		callManual: 'Połączenia ręczne',
		callHandled: 'Obsłużone połączenia',
		callMissed: 'Nieodebrane połączenia',
		callQueueMissed: 'Przegapione z kolejek',
		avgTalk: 'Śr. czas rozmowy',
		avgHold: 'Śr. czas oczekiwania',
		utilization: 'Wykorzystanie',
		occupancy: 'Zajętość',
		chatAccepts: 'Zaakceptowane czaty',
		chatAht: 'Czas obsługi czatu',
		scoreCount: 'Ocenione połączenia',
		scoreAvg: 'Średnia ocena',
		sumTalk: 'Łączny czas rozmów',
		processing: 'Czas po rozmowie',
		available: 'Dostępny',
		voiceMail: 'Łączny czas VM',
		queueTalk: 'Czas rozmowy w kolejce',
		taskAccepts: 'Liczba zadań',
	},
	queueSec: {
		call: {
			call: 'Połączenie | Połączenia',
			preview: {
				md: {
					active: 'Aktywne połączenia',
					missed: 'Nieodebrane połączenia',
					offline: 'Połączenia offline',
					manual: 'Ręcznie przypisane połączenia',
				},
				sm: {
					active: 'Aktywne',
					missed: 'Nieodebrane',
					offline: 'Offline',
					manual: 'Ręcznie przypisane',
				},
			},
		},
		chat: {
			chats: 'Czat | Czaty',
			preview: {
				md: {
					active: 'Aktywne czaty',
					manual: 'Ręcznie przypisane czaty',
					closed: 'Zamknięte czaty',
				},
				sm: {
					active: 'Aktywne',
					manual: 'Ręcznie przypisane',
					closed: 'Zamknięte',
				},
			},
		},
		job: {
			jobs: 'Zadanie | Zadania',
			preview: {
				md: {
					active: 'Aktywne zadania',
				},
				sm: {
					active: 'Aktywne',
				},
			},
		},
	},
	infoSec: {
		generalInfo: {
			generalInfo: 'Informacje ogólne',
			queueWaiting: 'Oczekuje',
			queue: 'Kolejka | Kolejki',
			agents: 'Agenci',
			total: 'Łącznie',
			pauses: 'Przerwy',
			free: 'Wolny',
			score: 'Ocena agenta',
		},
		clientInfo: 'Informacje o kliencie',
		memberDescription: 'Opis członka',
		variables: 'Zmienne',
		contacts: {
			client: 'Klient',
			manager: 'Właściciel',
			attributes: 'Atrybut | Atrybuty',
			emptyContact: 'Nie znaleziono kontaktu',
			emptyLabels: 'Brak etykiet',
			emptyAttributes: 'Brak atrybutów',
			emptyDescription: 'Brak opisu',
			foundOneContact: '{ count } znaleziony kontakt',
			foundSomeContact: '{ current } z { count } kontaktów',
			communications: 'Opcje komunikacji',
			destination: 'Cel',
			searchPlaceholder: 'Wprowadź kryteria wyszukiwania',
		},
		knowledgeBase: 'Baza wiedzy',
		processing: {
			title: 'Przetwarzanie zadania',
			reporting: {
				isSuccess: 'Czy zadanie zakończyło się sukcesem?',
				yes: 'Tak',
				no: 'Nie',
				nextDistributeAtTitle: 'Zaplanować następne zadanie?',
				nextDistributeAt: 'Czas następnego zadania',
			},
			form: {
				formFile: {
					deleteConfirmation: 'Czy na pewno chcesz usunąć ten plik?',
					empty: 'Brak plików',
				},
				formTable: {
					title: 'Tabela',
					error:
						'Dane tabeli mają nieprawidłowy format. Sprawdź swój przepływ.',
				},
			},
		},
		flows: {
			dummy: 'Nie skonfigurowano jeszcze żadnych schematów',
			runFlowSuccess: 'Schemat uruchomiony pomyślnie',
			runFlowError: 'Nie udało się uruchomić schematu',
		},
	},
	workspaceSec: {
		callState: {
			ringing: 'Dzwoni',
			inCall: 'W rozmowie',
			onHold: 'Wstrzymane',
			hangup: 'Zakończ',
		},
		chat: {
			acceptPreviewText:
				'Jeśli jesteś gotowy odpowiedzieć, kliknij najpierw przycisk "Akceptuj"',
			draftPlaceholder: 'Napisz wiadomość...',
			dropzone: {
				title: 'Upuść pliki tutaj',
				description: 'Aby je przesłać',
			},
			confirmClose: 'Czy na pewno chcesz zamknąć aktywny czat?',
			closedСhat: 'Czat został zamknięty',
			chatStarted: 'Czat rozpoczęty', // TODO: Translate
			chatEnded: 'Czat zakończony', // TODO: Translate
			chatTransferred: 'Czat przekazany', // TODO: Translate
			chatsAgent: '{ agentName } dołączył do czatu', // TODO: Translate
			chatsAgentsList: '{ agentName } uczestniczył w czacie', // TODO: Translate
			chatsFileBlocked: 'Plik w kwarantannie lub zablokowany',
			errors: {
				uploadFileLimitSize: 'Przekroczono limit rozmiaru pliku',
			},
		},
	},
	emptyWorkspace: {
		empty: {
			heading: 'Aktualnie nie ma połączeń ani czatów',
			text: 'Proszę czekać! Miłej pracy!',
		},
		transfer: {
			heading: 'Dziękujemy!',
			text: 'Zadanie zostało przekazane innemu operatorowi',
		},
	},
	emptySearch: {
		heading: 'Ups!',
		text: 'Wyszukiwanie nie przyniosło żadnych wyników',
	},
	bridge: {
		activeCalls: 'Aktywne połączenia',
		bridge: 'Most',
	},
	history: {
		today: 'Dzisiaj',
		yesterday: 'Wczoraj',
		openInHistory: 'Otwórz w historii',
	},
	transfer: {
		selectAgent: 'Wybierz agenta',
		transfer: 'Przekaż',
	},
	contacts: {
		phones: 'Telefon | Telefony',
		emails: 'Email | Emaile',
	},
	agentStatus: {
		callCenter: 'Call Center',
		breakPopup: {
			breakReason: 'Powód przerwy',
			commons: {
				coffeeBreak: 'Przerwa na kawę',
				smokeBreak: 'Przerwa na papierosa',
				restroom: 'Toaleta',
				dinner: 'Obiad',
				meeting: 'Spotkanie',
			},
		},
		breakTimer: {
			heading: 'Jesteś teraz w trybie {mode}',
			mode: {
				[AgentStatus.Pause]: 'przerwa',
				[AgentStatus.BreakOut]: 'przerwa wymuszona',
			},
			[AgentStatus.BreakOut]: 'Przerwa wymuszona',
			continueWork: 'Kontynuuj pracę',
		},
	},
	disconnectPopup: {
		title: 'Coś poszło nie tak!',
		mainText: 'Połączenie zostało przerwane.',
		reloadBtn: 'Odśwież stronę',
	},
	welcomePopup: {
		title: 'Witamy w Webitel Agent Workspace!',
		subtitle:
			'Przed rozpoczęciem sprawdź swoje urządzenia i uprawnienia przeglądarki',
		mic: {
			status: 'Status uprawnień mikrofonu',
			message: {
				notFound: 'Nie znaleziono mikrofonu',
				denied: 'Odmowa dostępu',
			},
		},
		notifications: {
			status: 'Status uprawnień do powiadomień',
			message: {
				denied: 'Odmowa dostępu',
			},
		},
		camera: {
			status: 'Status uprawnień do kamery',
			message: {
				notFound: 'Kamera nie znaleziona',
				denied: 'Odmowa dostępu',
			},
		},
	},
	descTrackAuthPopup: {
		title: 'Uwaga',
		errorLabel: 'Nie możesz pracować w Workspace',
		errorDescription:
			'DeskTrack nie jest uruchomiony lub nie jesteś zalogowany',
		successLabel: 'DeskTrack uruchomiony pomyślnie',
		successDescription: 'Możesz pracować w Workspace',
	},
	error: {
		general: 'Wystąpił błąd. Spróbuj ponownie.',
		websocket: {
			[DeviceNotFoundError.id]:
				'Mikrofon nie jest podłączony. Nie można wykonać akcji.',
			[DeviceNotAllowPermissionError.id]:
				'Odmowa dostępu do mikrofonu. Nie można wykonać akcji.',
			[LicencePermissionError.id.replaceAll('.', '_')]:
				'Nie możesz pracować w Workspace, ponieważ Twoja licencja wygasła.',
		},
		endpoint: {
			noLicense:
				'Nie możesz pracować w Workspace, ponieważ Twoja licencja wygasła.',
		},
	},
	notifications: {
		message: 'Nowa wiadomość od {name}',
		userInvite: 'Nowe zaproszenie do czatu od {name}',
		closeConversation: '{name} opuścił czat',
		[JobState.Distribute]: 'Nowe zadanie: {name}',
		newCall: 'Nowe połączenie', // TODO: Translate
		closedChatError: 'Nie udało się załadować zamkniętych czatów', // TODO: Translate
	},
	emojiPicker: {
		categoriesLabel: 'Kategorie',
		emojiUnsupportedMessage:
			'Twoja przeglądarka nie obsługuje kolorowych emoji.',
		favoritesLabel: 'Ulubione',
		loadingMessage: 'Ładowanie…',
		networkErrorMessage: 'Nie można załadować emoji.',
		regionLabel: 'Wybór emoji', // TODO: Translate
		searchDescription:
			'Gdy dostępne są wyniki wyszukiwania, naciśnij strzałkę w górę lub w dół, aby wybrać i enter, aby zatwierdzić.',
		searchLabel: 'Szukaj',
		searchResultsLabel: 'Wyniki wyszukiwania',
		skinToneDescription:
			'Po rozwinięciu naciśnij strzałkę w górę lub w dół, aby wybrać i enter, aby zatwierdzić.',
		skinToneLabel: 'Wybierz odcień skóry',
		skinTonesLabel: 'Odcienie skóry',
		skinTones: [
			'Domyślny',
			'Jasny',
			'Średnio jasny',
			'Średni',
			'Średnio ciemny',
			'Ciemny',
		],
		categories: {
			custom: 'Własne',
			'smileys-emotion': 'Emotikony i uśmiechy',
			'people-body': 'Ludzie i ciało',
			'animals-nature': 'Zwierzęta i natura',
			'food-drink': 'Jedzenie i napoje',
			'travel-places': 'Podróże i miejsca',
			activities: 'Aktywności',
			objects: 'Obiekty',
			symbols: 'Symbole',
			flags: 'Flagi',
		},
	},
	confirmationPopup: {
		title: 'Potwierdź akcję',
	},
};
