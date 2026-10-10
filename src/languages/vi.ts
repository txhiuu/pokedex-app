export const vi = {
  appName: 'Pokédex',
  loading: 'Đang tải...',

  //EVOLUTION CONDITIONS
  useItem: 'Dùng',
  trade: 'Trao đổi',
  friendship: 'Thân thiết',
  atTime: 'Vào',
  special: 'Đặc biệt',

  //HOME
  homeSubtitle: 'Tìm Pokémon theo tên hoặc số National Pokédex.',
  searchPlaceholder: 'Tên hoặc số',
  sortByName: 'Theo tên',
  sortById: 'Theo ID',
  sortNameAsc: 'Tên (A → Z)',
  sortNameDesc: 'Tên (Z → A)',
  sortIdAsc: 'ID (Tăng dần)',
  sortIdDesc: 'ID (Giảm dần)',

  //TABS
  tabForms: 'Forms',
  tabDetail: 'Chi tiết',
  tabMoves: 'Chiêu thức',
  tabStats: 'Chỉ số',
  tabLocation: 'Địa điểm',
  tabType: 'Hệ',

  //DETAILS
  evolutionChain: 'CHUỖI TIẾN HÓA',
  megaEvolution: 'Mega Evolution',
  height: 'Chiều cao',
  weight: 'Cân nặng',
  baseExp: 'Kinh nghiệm cơ bản',
  abilities: 'Kỹ năng',
  total: 'Tổng',
  noNaturalAppearance: 'Pokemon này không xuất hiện trong tự nhiên.',
  heldItems: '🎁 Vật phẩm có thể cầm',
  weakAgainst: 'Yếu với:',
  resistantAgainst: 'Kháng:',
  immuneTo: 'Miễn nhiễm với:',
  notFound: 'Không có pokemon mà bạn tìm kiếm!!!',
  notFoundHint: 'Vui lòng kiểm tra lại tên hoặc số Pokedex.',
  goBack: 'Quay lại',

  //FAVOURITE
  favouriteTitle: 'Yêu thích',
  noFavourite: 'Chưa có Pokemon yêu thích',
  noFavouriteHint: 'Hãy bấm vào trái tim ở trang chi tiết để thêm vào đây nhé!',

  //SETTINGS
  settingsTitle: 'Cài đặt',
  statsTitle: 'THỐNG KÊ CỦA BẠN',
  favouritesCount: 'Yêu thích',
  seenCount: 'Đã xem',
  trainerName: 'Pokédex Trainer',
  performance: 'Hiệu năng',
  darkMode: 'Chế độ tối',
  animation: 'Hoạt ảnh',
  favouriteTypes: 'Hệ yêu thích',
  system: 'Hệ thống',
  language: 'Ngôn ngữ',
  unit: 'Đơn vị đo',
  about: 'Về ứng dụng',
  resetData: 'Xóa dữ liệu',
  credit: 'Made with ❤️ by',
  version: 'Phiên bản',
  resetTitle: '⚠️ Xóa toàn bộ dữ liệu',
  resetMessage: 'Bạn có chắc chắn muốn xóa hết Pokemon yêu thích và cài đặt? Hành động này không thể hoàn tác!',
  cancel: 'Hủy',
  delete: 'Xóa',
  deleted: '✅ Đã xóa',
  deletedMessage: 'Toàn bộ dữ liệu đã được xóa. Hãy khởi động lại app!',

  //LANGUAGE MODAL
  selectLanguage: 'Chọn ngôn ngữ',
  vietnamese: 'Tiếng Việt',
  english: 'English',
};

export type TranslationKey = keyof typeof vi;