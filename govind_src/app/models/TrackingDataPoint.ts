import {ManageDataPointCategories} from './TrackingDataPointCategories';

export class TrackingDataPoint {
    id: number;
    facilityId: number;
    scopeID: number;
    scopeName: string;
    manageDataPointCategories: ManageDataPointCategories[];
}
