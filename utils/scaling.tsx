import {Dimensions, Platform} from 'react-native';

const { width, height } = Dimensions.get('window');

const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;


const scale = (size: number): number => (width / guidelineBaseWidth) * size;
const verticalScale = (size: number): number => (height / guidelineBaseHeight) * size;
const moderateScale = (size: number, factor: number = 0.5): number => size + (scale(size) - size) * factor;
const isTablet = width > 768;
const isAndroid = Platform.OS === 'android';


export { scale, verticalScale, moderateScale, isTablet, width, height,isAndroid };
