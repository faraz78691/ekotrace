
import { LoginInfo } from '@/models/loginInfo';
import { Component, ElementRef, Input, Renderer2, ViewChild, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// import FamilyTree from '@balkangraph/familytree.js';

import FamilyTree from "assets/balkanapp/familytree";
import { FamilyService } from '@services/family.service';
import { NotificationService } from '@services/notification.service';
import { TrackingService } from '@services/tracking.service';
import { ToastrService } from 'ngx-toastr';
import { InputTextModule } from 'primeng/inputtext';
import { Observable, tap } from 'rxjs';
import { environment } from 'environments/environment';
import { ChangeDetectorRef, NgZone } from '@angular/core';
declare var $: any;
@Component({
    selector: 'app-tree',
    templateUrl: './tree.component.html',
    styleUrls: ['./tree.component.scss']
})
export class TreeComponent {
    @ViewChild('nodeForm') nodeForm: any;
    @ViewChild('cancel2') hideModal: any;
    @ViewChild('GroupForm') form: any;
    treeList$ = new Observable();
    nodeTitle: string;
    nodeSubtitle: string;
    displayBasic: boolean;
    selectedTree: any;
    public loginInfo: LoginInfo;
    selectedId: number;
    @Input() id!: string;
    selectedNode: number;
    loadFamilyData: any[] = [];
    paylaodFamilyData: any;
    newFamilyData: any[] = [];
    familyId: any;
    selectedTemplateId = 1;
    facilityTab = false;
    nodeType: any[] = [];
    treeList: any[] = [];
    newArray: any[] = [];
    lastObject: any;
    oldID = false;
    saveButtton = true;
    treeSection = true;
    constructor(
        private renderer: Renderer2,
        private route: ActivatedRoute,
        private router: Router,
        private trackingService: TrackingService,
        private notification: NotificationService,
        private toastr: ToastrService,
        private familyService: FamilyService,
        private cdr: ChangeDetectorRef,
        private ngZone: NgZone
    ) {
        if (localStorage.getItem('LoginInfo') != null) {
            let userInfo = localStorage.getItem('LoginInfo');
            let jsonObj = JSON.parse(userInfo); // string to "any" object first
            this.loginInfo = jsonObj as LoginInfo;

        };


    };

    ngOnInit() {

        this.treeList$ = this.familyService.getTreeList(this.loginInfo.super_admin_id).pipe(
            tap(items => {
                // console.log(items); // Log the entire response
                if (items.success) {
                    this.treeList = items.familyDetails;
                    console.log(this.treeList.length);
                    if (items.familyDetails.length > 1) {
                        if (this.loginInfo.role == 'Manager' || this.loginInfo.role == 'Admin' || this.loginInfo.role == 'Preparer') {
                            this.treeSection = false;
                        }
                        if (items.new_data == 1) {
                            this.familyId = items.family_id;
                            const selectedTempate = items.familyDetails.filter(value => value.family_id == this.familyId);
                            console.log(selectedTempate);
                            this.selectedTemplateId = selectedTempate[0].id;
                            this.createClone()
                        } else {
                            // this.familyId = items.familyDetails[0]?.family_id;
                            // this.getTreeViewByID(this.familyId); 
                        }
                    } else {
                        this.treeSection = true;
                        this.familyId = items.familyDetails[0].family_id;
                        this.selectedTemplateId = items.familyDetails[0].id;
                        if (this.loginInfo.role == 'Manager' || this.loginInfo.role == 'Admin' || this.loginInfo.role == 'Preparer') {
                            this.getTreeForOtherUser();
                        } else {
                            this.createClone();
                        }
                        this.saveButtton = false;
                    }
                }
            })
        );
        FamilyTree.templates.hugo.link_field_0 = '<text width="230" style="font-size: 18px;" fill="#ffffff" x="145" y="150" text-anchor="middle" class="field_0">{val}</text>';

    };




    onTemplateChange(event: any) {
        this.familyId = event.value
        this.getTreeViewByID(event.value);

    };


    onTypeChange(data) {
        if (data.value == 'Facility') {
            this.facilityTab = true
        } else {
            this.facilityTab = false;
        }
    }

    onCancel() {
        $(".ct_custom_modal_120").hide()
        const targetElement = document.getElementById('#cancel2');
        if (targetElement) {

            this.renderer.addClass(targetElement, 'none');
        }
        this.hideModal.nativeElement

    };

    getTreeViewByID(id) {

        const formData = new URLSearchParams();
        formData.set('family_id', id);

        this.familyService.getTreeById(formData.toString()).subscribe({
            next: (value) => {
                this.loadFamilyData = value.familyTreeDetails
                const tree = document.getElementById('tree');
                if (tree) {
                    FamilyTree.templates.base.defs =
                        `<g transform="matrix(0.05,0,0,0.05,-12,-9)" id="heart">
                        <path fill="#aeaeae" d="M438.482,58.61c-24.7-26.549-59.311-41.655-95.573-41.711c-36.291,0.042-70.938,15.14-95.676,41.694l-8.431,8.909  l-8.431-8.909C181.284,5.762,98.663,2.728,45.832,51.815c-2.341,2.176-4.602,4.436-6.778,6.778 c-52.072,56.166-52.072,142.968,0,199.134l187.358,197.581c6.482,6.843,17.284,7.136,24.127,0.654 c0.224-0.212,0.442-0.43,0.654-0.654l187.29-197.581C490.551,201.567,490.551,114.77,438.482,58.61z"/>
                        </g>
                     <g transform="matrix(1,0,0,1,0,0)" id="dot"></g>
                      <g id="base_node_menu" style="cursor:pointer;">
                          <rect x="0" y="0" fill="transparent" width="22" height="22"></rect>
                          <circle cx="4" cy="11" r="2" fill="#b1b9be"></circle>
                          <circle cx="11" cy="11" r="2" fill="#b1b9be"></circle>
                          <circle cx="18" cy="11" r="2" fill="#b1b9be"></circle>
                      </g>
                      <g style="cursor: pointer;" id="base_tree_menu">
                          <rect x="0" y="0" width="25" height="25" fill="transparent"></rect>
                          ${FamilyTree.icon.addUser(25, 25, '#fff', 0, 0)}
                      </g>
                      <g style="cursor: pointer;" id="base_tree_menu_close">
                          <circle cx="12.5" cy="12.5" r="12" fill="#F57C00"></circle>
                          ${FamilyTree.icon.close(25, 25, '#fff', 0, 0)}
                      </g>            
                      <g id="base_up">
                          <circle cx="115" cy="30" r="15" fill="#fff" stroke="#b1b9be" stroke-width="1"></circle>
                          ${FamilyTree.icon.ft(20, 80, '#b1b9be', 105, -10)}
                      </g>
                      <clipPath id="base_img_0">
                        <circle id="base_img_0_stroke" cx="45" cy="62" r="35"/>
                      </clipPath>
                      <clipPath id="base_img_1">
                        <circle id="base_img_1_stroke" cx="100" cy="62" r="35"/>
                      </clipPath>
                      `;

                    FamilyTree.templates.main = Object.assign({}, FamilyTree.templates.base);

                    FamilyTree.templates.main.node = '<rect x="0" y="0" height="{h}" width="{w}" fill="#ffffff" stroke-width="3" stroke="#ccc" rx="5" ry="5"></rect>' +
                        '<rect x="0" y="0" height="30" width="{w}" fill="#b1b9be" stroke-width="1" stroke="#b1b9be" style="fill: rgba(134, 175, 72, 0.7);" rx="5" ry="5"></rect>' +
                        '<line x1="0" y1="20" x2="250" y2="20" stroke-width="5" stroke="#b1b9be" style="display:none"></line>';

                    FamilyTree.templates.main.field_0 =
                        '<text ' + FamilyTree.attr.width + ' ="250" style="font-size: 14px; " font-variant="all-small-caps" fill="white" x="125" y="16" text-anchor="middle">{val}</text>';
                    FamilyTree.templates.main.field_1 =
                        '<text ' + FamilyTree.attr.width + ' ="160" data-text-overflow="multiline" style="font-size: 14px; transform: translateX(26px);" fill="black" x="100" y="66" text-anchor="middle">{val}</text>';
                    FamilyTree.templates.main.field_2 =
                        '<text ' + FamilyTree.attr.width + ' ="160" style="font-size: 10px; transform: translateX(26px)" fill="#b1b9be" x="100" y="95" text-anchor="middle">{val}</text>';
                    FamilyTree.templates.main.field_3 =
                        '<text ' + FamilyTree.attr.width + ' ="60" style="font-size: 12px;  transform: translateX(26px)" fill="black" x="47" y="112" text-anchor="middle">{val}</text>';
                    FamilyTree.templates.main.img_0 =
                        `<use xlink:href="#base_img_0_stroke" /> 
                       <circle id="base_img_0_stroke" fill="#b1b9be" cx="45" cy="62" r="37"/>
                      <image preserveAspectRatio="xMidYMid slice" clip-path="url(#base_img_0)" xlink:href="{val}" x="10" y="26" width="72" height="72"></image>`;


                    FamilyTree.templates.single = Object.assign({}, FamilyTree.templates.tommy);
                    FamilyTree.templates.single.size = [150, 150];

                    var family = new FamilyTree(tree, {


                        template: "main",
                        enableSearch: false,
                        nodeBinding: {
                            field_0: "relation",
                            field_1: "name",
                            field_2: "facility_name",
                        },
                        nodeMenu: {
                            details: { text: "Details" },
                            edit: { text: "Edit" },
                            add: {
                                text: "Add",

                                onClick: (node: string) => {

                                    var nodeData = family.get(node);
                                    var relationCat = nodeData['relation']
                                    console.log("nodeData", nodeData['relation']);


                                    localStorage.setItem("selectedNode", node);
                                    $(".ct_custom_modal_120").show(500);
                                    if (relationCat == 'Main Group') {
                                        this.nodeType = [
                                            {
                                                "id": '2',
                                                "nodetype": "Sub Group"
                                            },
                                        ];
                                    } else if (relationCat == 'Sub Group') {
                                        this.nodeType = [
                                            {
                                                "id": '3',
                                                "nodetype": "Facility"
                                            }
                                        ];
                                    } else if (relationCat == 'Facility') {
                                        this.nodeType = [];
                                    }
                                }
                                // onClick: callHandler2
                            },
                            remove: {
                                text: "Remove", onClick: callHandler
                            }
                        },
                        editForm: {
                            addMoreFieldName: null,
                            addMore: null,
                            addMoreBtn: null,
                            generateElementsFromFields: false,
                            elements: [
                                { type: 'textbox', label: 'Name', binding: 'name' },

                                { type: 'textbox', label: 'Facility name', binding: 'facility_name' }

                            ],
                            buttons: {
                                edit: {
                                    icon: FamilyTree.icon.edit(24, 24, '#fff'),
                                    text: 'Edit',
                                    hideIfEditMode: true,
                                    hideIfDetailsMode: false
                                },
                                share: null,
                                pdf: null

                            }

                        },

                    });


                    function callHandler(nodeId) {
                        const token: string | null = localStorage.getItem('accessToken');
                        var nodeData = family.get(nodeId);
                        const formData = new URLSearchParams();
                        formData.append('id', nodeData['id'].toString());
                        formData.append('family_id', nodeData['family_id'].toString());
                        formData.append('new_child', '1');
                        formData.append('old_id', '1');


                        fetch(environment.baseUrl + '/deleteNode', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded',
                                auth: `Bearer ${token}`
                            },
                            body: formData.toString()
                        })
                            .then(response => response.json())
                            .then(data =>
                                window.location.reload()
                                // console.log(data)
                            )
                            .catch(error => console.error('Error:', error));


                    }


                    family.onUpdateNode((args) => {

                        const token: string | null = localStorage.getItem('accessToken');
                        var updateNode = args.updateNodesData[0];
                        const mainName = (args.updateNodesData[0] as any).relation;
                        updateNode['main_name'] = mainName
                        const formData = new URLSearchParams();
                        formData.append('update_data', JSON.stringify(updateNode));
                        formData.append('new_child', '1');
                        formData.set('old_id', '1');

                        fetch(environment.baseUrl + '/UpdateChildInTree', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded',
                                auth: `Bearer ${token}`
                            },
                            body: formData
                        })
                            .then(response => response.json())
                            // .then(data =>window.location.reload())
                            .then(data => this.createClone())
                            .catch(error => console.error('Error:', error));
                    }
                    )
                    family.load(
                        this.loadFamilyData
                    );
                }
            },
        })
    };

    showBasicDialog() {
        this.displayBasic = true;
    };

    onNodeAdd(data) {

        const getSelectedNode = localStorage.getItem("selectedNode");
        const nodeForm = new URLSearchParams();
        if (this.facilityTab == true) {
            nodeForm.set('facility_name', data.value.facility_type);
        }

        nodeForm.set('id', getSelectedNode);
        nodeForm.set('family_id', this.familyId);
        nodeForm.set('main_name', data.value.nodetype);
        nodeForm.set('name', data.value.nodeSubtitle);
        nodeForm.set('new_child', '1');
        if (this.oldID == false) {
            nodeForm.set('old_id', '1');
        } else {
            nodeForm.set('old_id', '0');
        }
        // nodeForm.set('jsonData',this.paylaodFamilyData );

        this.familyService.createChildTree(nodeForm.toString()).subscribe({
            next: res => {
                if (res.success == true) {
                    this.createClone();

                }
                console.log(res);
                // this.getTreeViewByID(this.selectedTemplateId);
            },
            error: err =>
                console.log(err)
        })
    };
    createClone() {

        const nodeForm = new URLSearchParams();
        nodeForm.set('family_id', this.familyId);
        nodeForm.set('tenant_id', this.loginInfo.super_admin_id.toString());

        this.familyService.createCloneTree(nodeForm.toString()).subscribe({
            next: res => {
                if (res.success == true) {
                    this.oldID = true;
                    this.newFamilyData = res.familyTreeDetails;
                    this.lastObject = this.newFamilyData[this.newFamilyData.length - 1];
                    this.newArray.push(this.lastObject);
                    this.paylaodFamilyData = JSON.stringify(this.newArray)
                    // this.paylaodFamilyData.push(this.lastObject)


                    this.loadFamilyData = this.newFamilyData;
                    const tree = document.getElementById('tree');
                    if (tree) {
                        FamilyTree.templates.base.defs =
                            `<g transform="matrix(0.05,0,0,0.05,-12,-9)" id="heart">
                            <path fill="#aeaeae" d="M438.482,58.61c-24.7-26.549-59.311-41.655-95.573-41.711c-36.291,0.042-70.938,15.14-95.676,41.694l-8.431,8.909  l-8.431-8.909C181.284,5.762,98.663,2.728,45.832,51.815c-2.341,2.176-4.602,4.436-6.778,6.778 c-52.072,56.166-52.072,142.968,0,199.134l187.358,197.581c6.482,6.843,17.284,7.136,24.127,0.654 c0.224-0.212,0.442-0.43,0.654-0.654l187.29-197.581C490.551,201.567,490.551,114.77,438.482,58.61z"/>
                            </g>
                         <g transform="matrix(1,0,0,1,0,0)" id="dot"></g>
                          <g id="base_node_menu" style="cursor:pointer;">
                              <rect x="0" y="0" fill="transparent" width="22" height="22"></rect>
                              <circle cx="4" cy="11" r="2" fill="#b1b9be"></circle>
                              <circle cx="11" cy="11" r="2" fill="#b1b9be"></circle>
                              <circle cx="18" cy="11" r="2" fill="#b1b9be"></circle>
                          </g>
                          <g style="cursor: pointer;" id="base_tree_menu">
                              <rect x="0" y="0" width="25" height="25" fill="transparent"></rect>
                              ${FamilyTree.icon.addUser(25, 25, '#fff', 0, 0)}
                          </g>
                          <g style="cursor: pointer;" id="base_tree_menu_close">
                              <circle cx="12.5" cy="12.5" r="12" fill="#F57C00"></circle>
                              ${FamilyTree.icon.close(25, 25, '#fff', 0, 0)}
                          </g>            
                          <g id="base_up">
                              <circle cx="115" cy="30" r="15" fill="#fff" stroke="#b1b9be" stroke-width="1"></circle>
                              ${FamilyTree.icon.ft(20, 80, '#b1b9be', 105, -10)}
                          </g>
                          <clipPath id="base_img_0">
                            <circle id="base_img_0_stroke" cx="45" cy="62" r="35"/>
                          </clipPath>
                          <clipPath id="base_img_1">
                            <circle id="base_img_1_stroke" cx="100" cy="62" r="35"/>
                          </clipPath>
                          `;

                        FamilyTree.templates.main = Object.assign({}, FamilyTree.templates.base);

                        FamilyTree.templates.main.node = '<rect x="0" y="0" height="{h}" width="{w}" fill="#ffffff" stroke-width="3" stroke="#ccc" rx="5" ry="5"></rect>' +
                            '<rect x="0" y="0" height="30" width="{w}" fill="#b1b9be" stroke-width="1" stroke="#b1b9be" style="fill: rgba(134, 175, 72, 0.7);" rx="5" ry="5"></rect>' +
                            '<line x1="0" y1="20" x2="250" y2="20" stroke-width="5" stroke="#b1b9be" style="display:none"></line>';

                        FamilyTree.templates.main.field_0 =
                            '<text ' + FamilyTree.attr.width + ' ="250" style="font-size: 14px; " font-variant="all-small-caps" fill="white" x="125" y="16" text-anchor="middle">{val}</text>';
                        FamilyTree.templates.main.field_1 =
                            '<text ' + FamilyTree.attr.width + ' ="160" data-text-overflow="multiline" style="font-size: 14px; transform: translateX(26px);" fill="black" x="100" y="66" text-anchor="middle">{val}</text>';
                        FamilyTree.templates.main.field_2 =
                            '<text ' + FamilyTree.attr.width + ' ="160" style="font-size: 10px; transform: translateX(26px)" fill="#b1b9be" x="100" y="95" text-anchor="middle">{val}</text>';
                        FamilyTree.templates.main.field_3 =
                            '<text ' + FamilyTree.attr.width + ' ="60" style="font-size: 12px;  transform: translateX(26px)" fill="black" x="47" y="112" text-anchor="middle">{val}</text>';
                        FamilyTree.templates.main.img_0 =
                            `<use xlink:href="#base_img_0_stroke" /> 
                           <circle id="base_img_0_stroke" fill="#b1b9be" cx="45" cy="62" r="37"/>
                          <image preserveAspectRatio="xMidYMid slice" clip-path="url(#base_img_0)" xlink:href="{val}" x="10" y="26" width="72" height="72"></image>`;


                        FamilyTree.templates.single = Object.assign({}, FamilyTree.templates.tommy);
                        FamilyTree.templates.single.size = [150, 150];

                        var family = new FamilyTree(tree, {


                            template: "main",
                            enableSearch: false,
                            nodeBinding: {
                                field_0: "relation",
                                field_1: "name",
                                field_2: "facility_name",
                            },
                            nodeMenu: {
                                details: { text: "Details" },
                                edit: { text: "Edit" },
                                add: {
                                    text: "Add",
                                    onClick: (node: string) => {
                                        $(".ct_custom_modal_120").show(500)
                                        var nodeData = family.get(node);
                                        console.log("nodeData", nodeData);
                                        localStorage.setItem("selectedNode", node);
                                        var relationCat = nodeData['relation']
                                        if (relationCat == 'Main Group') {
                                            this.nodeType = [
                                                {
                                                    "id": '2',
                                                    "nodetype": "Sub Group"
                                                },
                                            ];
                                        } else if (relationCat == 'Sub Group') {
                                            this.nodeType = [
                                                {
                                                    "id": '3',
                                                    "nodetype": "Facility"
                                                }
                                            ];
                                        } else if (relationCat == 'Facility') {
                                            this.nodeType = [];
                                        }
                                    }
                                    // onClick: callHandler2
                                },
                                remove: {
                                    text: "Remove", onClick: callHandler
                                }
                            },
                            editForm: {
                                addMoreFieldName: null,
                                addMore: null,
                                addMoreBtn: null,
                                generateElementsFromFields: false,
                                elements: [
                                    { type: 'textbox', label: 'Name', binding: 'name' },
                                    { type: 'textbox', label: 'Facility type', binding: 'facility_name', options: ['select'] }
                                ],
                                buttons: {
                                    edit: {
                                        icon: FamilyTree.icon.edit(24, 24, '#fff'),
                                        text: 'Edit',
                                        hideIfEditMode: true,
                                        hideIfDetailsMode: false
                                    },
                                    share: null,
                                    pdf: null

                                }
                            },

                        });

                        function callHandler(nodeId) {
                            const token: string | null = localStorage.getItem('accessToken');
                            var nodeData = family.get(nodeId);
                            const formData = new URLSearchParams();
                            formData.append('id', nodeData['id'].toString());
                            formData.append('family_id', nodeData['family_id'].toString());
                            formData.append('new_child', '1');
                            if (this.oldID == false) {
                                formData.set('old_id', '1');
                            } else {
                                formData.set('old_id', '0');
                            }
                            fetch(environment.baseUrl + '/deleteNode', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/x-www-form-urlencoded',
                                    auth: `Bearer ${token}`
                                },
                                body: formData.toString()
                            })
                                .then(response => response.json())
                                .then(data => family.removeNode(nodeId)
                                    // console.log(data)
                                )
                                .catch(error => console.error('Error:', error));


                        }
                        family.onUpdateNode((args) => {
                            const token: string | null = localStorage.getItem('accessToken');
                            var updateNode = args.updateNodesData[0];
                            const mainName = (args.updateNodesData[0] as any).relation;
                            updateNode['main_name'] = mainName

                            const formData = new URLSearchParams();
                            formData.append('update_data', JSON.stringify(updateNode));
                            formData.append('new_child', '1');
                            if (this.oldID == false) {
                                formData.set('old_id', '1');
                            } else {
                                formData.set('old_id', '0');
                            }

                            fetch(environment.baseUrl + '/UpdateChildInTree', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/x-www-form-urlencoded',
                                    auth: `Bearer ${token}`
                                },
                                body: formData
                            })
                                .then(response => response.json())
                                .then(data => console.log(data))
                                .catch(error => console.error('Error:', error));
                        }
                        )
                        family.load(
                            this.loadFamilyData
                        );
                    }
                    $(".ct_custom_modal_120").hide()
                    this.nodeForm.reset();
                    this.facilityTab = false;

                }
                console.log(res);
                // this.getTreeViewByID(this.selectedTemplateId);
            },
            error: err =>
                console.log(err)
        })
    };

    getTreeForOtherUser() {

        const nodeForm = new URLSearchParams();
        nodeForm.set('family_id', this.familyId);
        nodeForm.set('tenant_id', this.loginInfo.super_admin_id.toString());

        this.familyService.createCloneTree(nodeForm.toString()).subscribe({
            next: res => {
                if (res.success == true) {
                    this.oldID = true;
                    this.newFamilyData = res.familyTreeDetails;
                    this.lastObject = this.newFamilyData[this.newFamilyData.length - 1];
                    this.newArray.push(this.lastObject);
                    this.paylaodFamilyData = JSON.stringify(this.newArray)
                    // this.paylaodFamilyData.push(this.lastObject)


                    this.loadFamilyData = this.newFamilyData;
                    const tree = document.getElementById('tree');
                    if (tree) {
                        FamilyTree.templates.base.defs =
                            `<g transform="matrix(0.05,0,0,0.05,-12,-9)" id="heart">
                            <path fill="#aeaeae" d="M438.482,58.61c-24.7-26.549-59.311-41.655-95.573-41.711c-36.291,0.042-70.938,15.14-95.676,41.694l-8.431,8.909  l-8.431-8.909C181.284,5.762,98.663,2.728,45.832,51.815c-2.341,2.176-4.602,4.436-6.778,6.778 c-52.072,56.166-52.072,142.968,0,199.134l187.358,197.581c6.482,6.843,17.284,7.136,24.127,0.654 c0.224-0.212,0.442-0.43,0.654-0.654l187.29-197.581C490.551,201.567,490.551,114.77,438.482,58.61z"/>
                            </g>
                         <g transform="matrix(1,0,0,1,0,0)" id="dot"></g>
                          <g id="base_node_menu" style="cursor:pointer;">
                              <rect x="0" y="0" fill="transparent" width="22" height="22"></rect>
                              <circle cx="4" cy="11" r="2" fill="#b1b9be"></circle>
                              <circle cx="11" cy="11" r="2" fill="#b1b9be"></circle>
                              <circle cx="18" cy="11" r="2" fill="#b1b9be"></circle>
                          </g>
                          <g style="cursor: pointer;" id="base_tree_menu">
                              <rect x="0" y="0" width="25" height="25" fill="transparent"></rect>
                              ${FamilyTree.icon.addUser(25, 25, '#fff', 0, 0)}
                          </g>
                          <g style="cursor: pointer;" id="base_tree_menu_close">
                              <circle cx="12.5" cy="12.5" r="12" fill="#F57C00"></circle>
                              ${FamilyTree.icon.close(25, 25, '#fff', 0, 0)}
                          </g>            
                          <g id="base_up">
                              <circle cx="115" cy="30" r="15" fill="#fff" stroke="#b1b9be" stroke-width="1"></circle>
                              ${FamilyTree.icon.ft(20, 80, '#b1b9be', 105, -10)}
                          </g>
                          <clipPath id="base_img_0">
                            <circle id="base_img_0_stroke" cx="45" cy="62" r="35"/>
                          </clipPath>
                          <clipPath id="base_img_1">
                            <circle id="base_img_1_stroke" cx="100" cy="62" r="35"/>
                          </clipPath>
                          `;

                        FamilyTree.templates.main = Object.assign({}, FamilyTree.templates.base);

                        FamilyTree.templates.main.node = '<rect x="0" y="0" height="{h}" width="{w}" fill="#ffffff" stroke-width="3" stroke="#ccc" rx="5" ry="5"></rect>' +
                            '<rect x="0" y="0" height="30" width="{w}" fill="#b1b9be" stroke-width="1" stroke="#b1b9be" style="fill: rgba(134, 175, 72, 0.7);" rx="5" ry="5"></rect>' +
                            '<line x1="0" y1="20" x2="250" y2="20" stroke-width="5" stroke="#b1b9be" style="display:none"></line>';

                        FamilyTree.templates.main.field_0 =
                            '<text ' + FamilyTree.attr.width + ' ="250" style="font-size: 14px; " font-variant="all-small-caps" fill="white" x="125" y="16" text-anchor="middle">{val}</text>';
                        FamilyTree.templates.main.field_1 =
                            '<text ' + FamilyTree.attr.width + ' ="160" data-text-overflow="multiline" style="font-size: 14px; transform: translateX(26px);" fill="black" x="100" y="66" text-anchor="middle">{val}</text>';
                        FamilyTree.templates.main.field_2 =
                            '<text ' + FamilyTree.attr.width + ' ="160" style="font-size: 10px; transform: translateX(26px)" fill="#b1b9be" x="100" y="95" text-anchor="middle">{val}</text>';
                        FamilyTree.templates.main.field_3 =
                            '<text ' + FamilyTree.attr.width + ' ="60" style="font-size: 12px;  transform: translateX(26px)" fill="black" x="47" y="112" text-anchor="middle">{val}</text>';
                        FamilyTree.templates.main.img_0 =
                            `<use xlink:href="#base_img_0_stroke" /> 
                           <circle id="base_img_0_stroke" fill="#b1b9be" cx="45" cy="62" r="37"/>
                          <image preserveAspectRatio="xMidYMid slice" clip-path="url(#base_img_0)" xlink:href="{val}" x="10" y="26" width="72" height="72"></image>`;


                        FamilyTree.templates.single = Object.assign({}, FamilyTree.templates.tommy);
                        FamilyTree.templates.single.size = [150, 150];

                        var family = new FamilyTree(tree, {


                            template: "main",
                            enableSearch: false,
                            nodeBinding: {
                                field_0: "relation",
                                field_1: "name",
                                field_2: "facility_name",
                            },
                            nodeMenu: {
                                details: { text: "Details" },

                            },
                            editForm: {
                                addMoreFieldName: null,
                                addMore: null,
                                addMoreBtn: null,
                                generateElementsFromFields: false,
                                elements: [
                                    { type: 'textbox', label: 'Name', binding: 'name' },
                                    { type: 'textbox', label: 'Facility type', binding: 'facility_name', options: ['select'] }
                                ],
                                buttons: {
                                    edit: {
                                        icon: FamilyTree.icon.edit(24, 24, '#fff'),
                                        text: 'Edit',
                                        hideIfEditMode: true,
                                        hideIfDetailsMode: true
                                    },
                                    share: null,
                                    pdf: null

                                }
                            }

                        });


                        family.load(
                            this.loadFamilyData
                        );
                    }
                    $(".ct_custom_modal_120").hide()
                    this.nodeForm.reset();
                    this.facilityTab = false;

                }
                console.log(res);
                // this.getTreeViewByID(this.selectedTemplateId);
            },
            error: err =>
                console.log(err)
        })
    };


    onSubmitORg(data: any) {

        const formData = new URLSearchParams();
        formData.set('tenant_id', this.loginInfo.tenantID.toString());
        formData.set('family_name', data.value.treename);
        formData.set('main_name', data.value.rootName);
        this.familyService.createTree(formData).subscribe({
            next: (response) => {
                console.log("response---", response);
                if (response.success == true) {
                    this.notification.showSuccess(
                        'Data entry added successfully',
                        'Success'
                    );
                    this.displayBasic = false
                    this.treeList$ = this.familyService.getTreeList(this.loginInfo.super_admin_id);
                    this.selectedTemplateId = response.insertDetails.insertId;
                    localStorage.setItem('tree_ID', this.selectedTemplateId.toString())
                    this.form.reset();
                    this.getTreeViewByID(response.insertDetails.insertId)
                }
            },
            error: (err) => {
                this.notification.showError(
                    'Data entry added failed.',
                    'Error'
                );
                console.error('errrrrrr>>>>>>', err);
            },
            complete: () => console.info('Data entry Added')
        });
    };


    OnSave(familyID: any) {
        const formData = new URLSearchParams();
        formData.set('family_id', familyID);
        formData.set('jsonData', JSON.stringify(this.loadFamilyData));

        this.familyService.createTree(formData.toString()).subscribe({
            next: (value) => {
                if (value.success == true) {
                    window.location.reload();

                }


            },
        })
    }




    ngOnDestroy() {
        console.log(this.treeList.length > 1)


        if (this.treeList.length > 1) {
            this.onDeleteFamilySample()
        }
        console.log("destroying child...")
    };


    onDeleteFamilySample() {


        const nodeForm = new URLSearchParams();
        nodeForm.set('family_id', this.familyId);

        this.familyService.deleteSampleTree(nodeForm.toString()).subscribe({
            next: res => {
                if (res.success == true) {


                }
                console.log(res);
                // this.getTreeViewByID(this.selectedTemplateId);
            },
            error: err =>
                console.log(err)
        })
    };


}
