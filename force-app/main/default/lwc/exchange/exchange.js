import { LightningElement} from 'lwc';

export default class Exchange extends LightningElement {

    isNewTrade = false;

    changeView() {
        this.isNewTrade = !this.isNewTrade;
    }
}