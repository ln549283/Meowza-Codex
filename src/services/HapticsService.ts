import { Capacitor } from '@capacitor/core';
import { Haptics,ImpactStyle,NotificationType } from '@capacitor/haptics';
import { SaveService } from './SaveService';
class HapticsServiceImpl {
 private async feedback(kind:'light'|'error'|'victory'){if(!SaveService.data.settings.vibrations)return;try{if(Capacitor.isNativePlatform()){if(kind==='light')await Haptics.impact({style:ImpactStyle.Light});else await Haptics.notification({type:kind==='error'?NotificationType.Error:NotificationType.Success});}else navigator.vibrate?.(kind==='light'?12:kind==='error'?[25,30,25]:[20,35,45]);}catch{/* Haptics are optional on unsupported hardware. */}}
 light(){return this.feedback('light');}error(){return this.feedback('error');}victory(){return this.feedback('victory');}
}
export const HapticsService=new HapticsServiceImpl();
