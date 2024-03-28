import { GroupMapping } from "./group-mapping";

export class Group {
    id: number;
    groupname: string;
    groupBy: string;
    tenantID: number; 
    CreatedDate = new Date();
    modifiedDate = new Date();
    active = true;
    groupMappings: GroupMapping[];
    facilities: any[];
package_name: any;
}
