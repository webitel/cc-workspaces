import {
  AgentStatus,
  DeviceNotAllowPermissionError,
  DeviceNotFoundError,
  JobState,
  LicencePermissionError,
} from 'webitel-sdk';

export default {
  reusable: {
    answer: 'Trả lời',
    reject: 'Từ chối',
    accept: 'Chấp nhận',
    decline: 'Từ chối',
    send: 'Gửi',
    save: 'Lưu',
    cancel: 'Hủy',
    close: 'Đóng',
    logout: 'Đăng xuất',
    search: 'Tìm kiếm',
    description: 'Mô tả',
    settings: 'Cài đặt',
    edit: 'Chỉnh sửa',
    select: 'Chọn',
    run: 'Chạy',
    today: 'Hôm nay',
  },
  feedback: {
    success: {
      title: 'Cảm ơn!',
      description: 'Phản hồi của bạn đã được lưu thành công',
    },
    error: {
      title: 'Rất tiếc!',
      description: 'Đã xảy ra sự cố',
    },
  },
  appNavigator: {
    title: 'Ứng dụng Webitel',
    admin: 'Admin',
    agent: 'Không gian làm việc Agent',
    supervisor: 'Không gian làm việc Supervisor',
    audit: 'Kiểm toán',
    history: 'Lịch sử cuộc gọi',
    grafana: 'Grafana',
  },
  header: {
    docs: 'Tài liệu',
    enableVideo: 'Bật video',
    dnd: {
      label: 'Không làm phiền',
      tooltip: 'Bạn sẽ chỉ nhận cuộc gọi từ các hàng đợi',
    },
  },
  widgets: {
    callInbound: 'Cuộc gọi đến',
    callHandled: 'Cuộc gọi đã xử lý',
    callMissed: 'Cuộc gọi nhỡ',
    avgTalk: 'Thời gian nói trung bình',
    avgHold: 'Thời gian giữ máy trung bình',
    utilization: 'Sử dụng',
    occupancy: 'Tỷ lệ bận',
    chatAccepts: 'Chat đã nhận',
    chatAht: 'Thời gian xử lý chat',
    scoreCount: 'Cuộc gọi đã đánh giá',
    scoreAvg: 'Tổng điểm',
    sumTalk: 'Tổng thời gian nói',
    processing: 'Thời gian xử lý sau cuộc gọi',
    available: 'Sẵn sàng',
    voiceMail: 'Tổng thời gian VM',
    queueTalk: 'Thời gian nói trong hàng đợi',
    taskAccepts: 'Số lượng nhiệm vụ',
  },
  queueSec: {
    call: {
      call: 'Cuộc gọi | Các cuộc gọi',
      preview: {
        md: {
          active: 'Cuộc gọi đang hoạt động',
          missed: 'Cuộc gọi nhỡ',
          offline: 'Cuộc gọi ngoại tuyến',
          manual: 'Cuộc gọi tự gán',
        },
        sm: {
          active: 'Đang hoạt động',
          missed: 'Nhỡ',
          offline: 'Ngoại tuyến',
          manual: 'Tự gán',
        },
      },
    },
    chat: {
      chats: 'Chat | Các chat',
      preview: {
        md: {
          active: 'Chat đang hoạt động',
          manual: 'Chat tự gán',
          closed: 'Chat đã đóng',
        },
        sm: {
          active: 'Đang hoạt động',
          manual: 'Tự gán',
          closed: 'Đã đóng',
        },
      },
    },
    job: {
      jobs: 'Nhiệm vụ | Các nhiệm vụ',
      preview: {
        md: {
          active: 'Nhiệm vụ đang hoạt động',
        },
        sm: {
          active: 'Đang hoạt động',
        },
      },
    },
  },
  infoSec: {
    generalInfo: {
      generalInfo: 'Thông tin chung',
      queueWaiting: 'Đang chờ',
      queue: 'Hàng đợi | Các hàng đợi',
      agents: 'Tác vụ',
      total: 'Tổng',
      pauses: 'Tạm dừng',
      free: 'Rảnh',
      score: 'Điểm tác vụ',
    },
    clientInfo: 'Thông tin khách hàng',
    memberDescription: 'Mô tả thành viên',
    variables: 'Biến',
    contacts: {
      client: 'Khách hàng',
      manager: 'Chủ sở hữu',
      attributes: 'Thuộc tính',
      emptyContact: 'Không tìm thấy liên hệ',
      emptyLabels: 'Không có nhãn',
      emptyAttributes: 'Không có thuộc tính',
      emptyDescription: 'Không có mô tả',
      foundOneContact: '{ count } liên hệ được tìm thấy',
      foundSomeContact: '{ current } trong { count } liên hệ',
      communications: 'Tùy chọn liên lạc',
      destination: 'Điểm đến',
      searchPlaceholder: 'Nhập tiêu chí tìm kiếm',
    },
    knowledgeBase: 'Cơ sở kiến thức',
    processing: {
      title: 'Xử lý nhiệm vụ',
      reporting: {
        isSuccess: 'Nhiệm vụ này có thành công không?',
        yes: 'Có',
        no: 'Không',
        nextDistributeAtTitle: 'Lên lịch nhiệm vụ tiếp theo?',
        nextDistributeAt: 'Thời gian nhiệm vụ tiếp theo',
      },
      form: {
        formFile: {
          deleteConfirmation: 'Bạn có chắc chắn muốn xóa tệp này không?',
          empty: 'Chưa có tệp nào',
        },
        formTable: {
          title: 'Bảng',
          error: 'Dữ liệu bảng không hợp lệ. Vui lòng kiểm tra luồng của bạn.',
        },
      },
    },
    flows: {
      dummy: 'Chưa có sơ đồ nào được cấu hình',
      runFlowSuccess: 'Khởi chạy sơ đồ thành công',
      runFlowError: 'Không thể khởi chạy sơ đồ',
    },
  },
  workspaceSec: {
    callState: {
      ringing: 'Đang đổ chuông...',
      hold: 'Giữ máy',
      hangup: 'Kết thúc',
    },
    chat: {
      acceptPreviewText:
        'Nếu bạn sẵn sàng trả lời, hãy nhấn nút "Chấp nhận" trước',
      draftPlaceholder: 'Viết tin nhắn...',
      dropzone: {
        title: 'Kéo thả tệp vào đây',
        description: 'Để tải lên',
      },
      confirmClose: 'Bạn có chắc chắn muốn đóng chat đang hoạt động không?',
      closedСhat: 'Chat đã đóng',
      chatStarted: 'Chat đã bắt đầu', // TODO: Translate
      chatEnded: 'Chat đã kết thúc', // TODO: Translate
      chatTransferred: 'Chat đã chuyển', // TODO: Translate
      chatsAgent: '{ agentName } đã tham gia chat', // TODO: Translate
      chatsAgentsList: '{ agentName } đã tham gia chat', // TODO: Translate
    },
  },
  emptyWorkspace: {
    empty: {
      heading: 'Hiện không có cuộc gọi hoặc chat nào',
      text: 'Vui lòng chờ! Chúc bạn làm việc vui vẻ!',
    },
    transfer: {
      heading: 'Cảm ơn!',
      text: 'Nhiệm vụ đã được chuyển cho tác vụ khác',
    },
  },
  emptySearch: {
    heading: 'Ôi!',
    text: 'Không tìm thấy kết quả nào',
  },
  bridge: {
    activeCalls: 'Cuộc gọi đang hoạt động',
    bridge: 'Kết nối',
  },
  history: {
    today: 'Hôm nay',
    yesterday: 'Hôm qua',
    openInHistory: 'Mở trong lịch sử',
  },
  transfer: {
    selectAgent: 'Vui lòng chọn tác vụ',
    transfer: 'Chuyển',
  },
  contacts: {
    phones: 'Điện thoại',
    emails: 'Email',
  },
  agentStatus: {
    callCenter: 'Trung tâm cuộc gọi',
    breakPopup: {
      breakReason: 'Lý do tạm dừng',
      commons: {
        coffeeBreak: 'Nghỉ cà phê',
        smokeBreak: 'Nghỉ hút thuốc',
        restroom: 'Nhà vệ sinh',
        dinner: 'Ăn trưa',
        meeting: 'Họp',
      },
    },
    breakTimer: {
      heading: 'Bạn đang ở chế độ {mode}',
      mode: {
        [AgentStatus.Pause]: 'tạm dừng',
        [AgentStatus.BreakOut]: 'tạm dừng bắt buộc',
      },
      [AgentStatus.BreakOut]: 'Tạm dừng bắt buộc',
      continueWork: 'Tiếp tục làm việc',
    },
  },
  disconnectPopup: {
    title: 'Ôi... Có gì đó sai!',
    mainText: 'Kết nối đã bị gián đoạn.',
    reloadBtn: 'Tải lại trang',
  },
  welcomePopup: {
    title: 'Chào mừng đến với Webitel Agent Workspace!',
    subtitle:
      'Vui lòng kiểm tra thiết bị và quyền trình duyệt trước khi bắt đầu',
    mic: {
      status: 'Trạng thái quyền micro',
      message: {
        notFound: 'Không tìm thấy micro',
        denied: 'Từ chối quyền',
      },
    },
    notifications: {
      status: 'Trạng thái quyền thông báo',
      message: {
        denied: 'Từ chối quyền',
      },
    },
  },
  error: {
    general: 'Đã xảy ra lỗi. Vui lòng thử lại.',
    websocket: {
      [DeviceNotFoundError.id]:
        'Micro không được kết nối. Không thể thực hiện hành động.',
      [DeviceNotAllowPermissionError.id]:
        'Từ chối truy cập micro. Không thể thực hiện hành động.',
      [LicencePermissionError.id.replaceAll('.', '_')]:
        'Bạn không thể làm việc trong Workspace vì giấy phép đã hết hạn.',
    },
    endpoint: {
      noLicense:
        'Bạn không thể làm việc trong Workspace vì giấy phép đã hết hạn.',
    },
  },
  notifications: {
    message: 'Tin nhắn mới từ {name}',
    userInvite: 'Lời mời chat mới từ {name}',
    closeConversation: '{name} đã rời chat',
    [JobState.Distribute]: 'Nhiệm vụ mới: {name}',
    newCall: 'Cuộc gọi mới', // TODO: Translate
    closedChatError: 'Không thể tải chat đã đóng', // TODO: Translate
  },
  emojiPicker: {
    categoriesLabel: 'Danh mục',
    emojiUnsupportedMessage: 'Trình duyệt của bạn không hỗ trợ emoji màu.',
    favoritesLabel: 'Yêu thích',
    loadingMessage: 'Đang tải…',
    networkErrorMessage: 'Không thể tải emoji.',
    regionLabel: 'Bộ chọn emoji',
    searchDescription:
      'Khi có kết quả tìm kiếm, nhấn lên hoặc xuống để chọn và enter để xác nhận.',
    searchLabel: 'Tìm kiếm',
    searchResultsLabel: 'Kết quả tìm kiếm',
    skinToneDescription:
      'Khi mở rộng, nhấn lên hoặc xuống để chọn và enter để xác nhận.',
    skinToneLabel: 'Chọn màu da',
    skinTonesLabel: 'Màu da',
    skinTones: ['Mặc định', 'Sáng', 'Sáng vừa', 'Trung bình', 'Tối vừa', 'Tối'],
    categories: {
      custom: 'Tùy chỉnh',
      'smileys-emotion': 'Biểu tượng cảm xúc',
      'people-body': 'Con người và cơ thể',
      'animals-nature': 'Động vật và thiên nhiên',
      'food-drink': 'Đồ ăn và đồ uống',
      'travel-places': 'Du lịch và địa điểm',
      activities: 'Hoạt động',
      objects: 'Đồ vật',
      symbols: 'Ký hiệu',
      flags: 'Cờ',
    },
  },
  confirmationPopup: {
    title: 'Xác nhận hành động',
  },
  autocompleteList: {
    quickReplies: ({ linked }) =>
      `/${linked('objects.quickReplies.quickReplies', 1).toLowerCase()}`,
    quickRepliesDescription: 'Mở menu trả lời nhanh trong chat',
  },
};
