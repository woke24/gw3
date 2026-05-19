import { ref, reactive } from 'vue'
import ultraImg from '@/assets/product/ultra.png';
import enhancedImg from '@/assets/product/plus_enhanced.png';
import plusImg from '@/assets/product/plus.png';
import coreImg from '@/assets/product/core.png';
import walkcImg from '@/assets/product/walk_c.png';
import locosImg from '@/assets/product/loco_s.png';
import locoImg from '@/assets/product/loco.png';

// All KAT Devices
export const allKatDevices = reactive([{
  deviceName: 'KAT loco S',
  deviceType: 2,
  img: locosImg,
  receiverPid: '0x2F15',
  receiverVid: '0xC4F4',
  waistPid: '0x7F15',
  waistVid: '0xC4F4',
  footPid: '0x6F14',
  footVid: '0xC4F4',
}, {
  deviceName: 'KAT Walk C',
  deviceType: 3,
  img: walkcImg,
  receiverPid: '0x2F26',
  receiverVid: '0xC4F4',
  hallSensorPid: '0x8F25',
  hallSensorVid: '0xC4F4',
  footPid: '0x6F24',
  footVid: '0xC4F4',
},
{
  deviceName: 'KAT Walk C 2',
  deviceType: 4,
  img: plusImg,
  receiverPid: '0x2F37',
  receiverVid: '0xC4F4',
  directionPid: '0x7F37',
  directionVid: '0xC4F4',
  footPid: '0x6F37',
  footVid: '0xC4F4',
  sittingPid: '0x8F37',
  sittingVid: '0xC4F4',
  armbandPid: '0xBF13',
  armbandVid: '0xC4F4',
}, {
  deviceName: 'KAT Walk C 2 Core',
  deviceType: 8,
  img: coreImg,
  receiverPid: '0x3F37',
  receiverVid: '0xC4F4',
  directionPid: '0x4F37',
  directionVid: '0xC4F4',
  footPid: '0x5F37',
  footVid: '0xC4F4',
  sittingPid: '0xBF37',
  sittingVid: '0xC4F4',
  armbandPid: '0xBF13',
  armbandVid: '0xC4F4',
}, {
  deviceName: 'KAT Walk C2 Plus Enhanced',
  deviceType: 9,
  img: enhancedImg,
  receiverPid: '0x3F12',
  receiverVid: '0xC4F4',
  directionPid: '0x4F12',
  directionVid: '0xC4F4',
  footPid: '0x5F12',
  footVid: '0xC4F4',
  sittingPid: '0xBF12',
  sittingVid: '0xC4F4',
  armbandPid: '0xBF13',
  armbandVid: '0xC4F4',
}]);
