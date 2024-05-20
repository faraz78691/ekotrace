
import { LoginInfo } from '@/models/loginInfo';
import { Component, ElementRef, Input, Renderer2, ViewChild, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import FamilyTree from '@balkangraph/familytree.js';
import { FamilyService } from '@services/family.service';
import { NotificationService } from '@services/notification.service';
import { TrackingService } from '@services/tracking.service';
import { ToastrService } from 'ngx-toastr';
import { InputTextModule } from 'primeng/inputtext';
import { Observable } from 'rxjs';

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
    selectedTemplateId = 1;
    facilityTab = false;
    nodeType: any[] = [];
    constructor(
        private renderer: Renderer2,
        private route: ActivatedRoute,
        private router: Router,
        private trackingService: TrackingService,
        private notification: NotificationService,
        private toastr: ToastrService,
        private familyService: FamilyService
    ) {
        this.treeList$ = familyService.getTreeList();
        this.nodeType =
            [
                {
                    "id": '1',
                    "nodetype": "Main Group"
                },
                {
                    "id": '2',
                    "nodetype": "Sub Group"
                },
                {
                    "id": '3',
                    "nodetype": "Facility"
                }
            ]

    }
    ngOnInit() {
        FamilyTree.templates.hugo.link_field_0 = '<text width="230" style="font-size: 18px;" fill="#ffffff" x="145" y="150" text-anchor="middle" class="field_0">{val}</text>';
        this.getTreeViewByID('1');

    };

    onTemplateChange(event: any) {
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
            console.log('fd')
            this.renderer.addClass(targetElement, 'none');
        }
        this.hideModal.nativeElement

    }

    getTreeViewByID(id) {
        const formData = new URLSearchParams();
        formData.set('family_id', id);

        this.familyService.getTreeById(formData.toString()).subscribe({
            next(value) {
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
                    FamilyTree.templates.main.defs = `<style>
                                                        .{randId} .bft-edit-form-header, .{randId} .bft-img-button{
                                                            background-color: #aeaeae;
                                                        }
                                                        .{randId}.male .bft-edit-form-header, .{randId}.male .bft-img-button{
                                                            background-color: #6bb4df;
                                                        }        
                                                        .{randId}.male div.bft-img-button:hover{
                                                            background-color: #cb4aaf;
                                                        }
                                                        .{randId}.female .bft-edit-form-header, .{randId}.female .bft-img-button{
                                                            background-color: #cb4aaf;
                                                        }        
                                                        .{randId}.female div.bft-img-button:hover{
                                                            background-color: #6bb4df;
                                                        }
                    </style>`;
                    FamilyTree.templates.main.node = '<rect x="0" y="0" height="{h}" width="{w}" fill="#ffffff" stroke-width="3" stroke="#ccc" rx="5" ry="5"></rect>' +
                        '<rect x="0" y="0" height="30" width="{w}" fill="#b1b9be" stroke-width="1" stroke="#b1b9be" style="fill: rgba(134, 175, 72, 0.7);" rx="5" ry="5"></rect>' +
                        '<line x1="0" y1="20" x2="250" y2="20" stroke-width="5" stroke="#b1b9be" style="display:none"></line>';

                    FamilyTree.templates.main.field_0 =
                        '<text ' + FamilyTree.attr.width + ' ="250" style="font-size: 14px;" font-variant="all-small-caps" fill="white" x="125" y="16" text-anchor="middle">{val}</text>';
                    FamilyTree.templates.main.field_1 =
                        '<text ' + FamilyTree.attr.width + ' ="160" data-text-overflow="multiline" style="font-size: 14px;" fill="black" x="100" y="66" text-anchor="start">{val}</text>';
                    FamilyTree.templates.main.field_2 =
                        '<text ' + FamilyTree.attr.width + ' ="160" style="font-size: 10px;" fill="#b1b9be" x="100" y="95" text-anchor="start">{val}</text>';
                    FamilyTree.templates.main.field_3 =
                        '<text ' + FamilyTree.attr.width + ' ="60" style="font-size: 12px;" fill="black" x="47" y="112" text-anchor="middle">{val}</text>';
                    FamilyTree.templates.main.img_0 =
                        `<use xlink:href="#base_img_0_stroke" /> 
                       <circle id="base_img_0_stroke" fill="#b1b9be" cx="45" cy="62" r="37"/>
                      <image preserveAspectRatio="xMidYMid slice" clip-path="url(#base_img_0)" xlink:href="{val}" x="10" y="26" width="72" height="72"></image>`;


                    FamilyTree.templates.single = Object.assign({}, FamilyTree.templates.tommy);
                    FamilyTree.templates.single.size = [200, 200];
                    FamilyTree.templates.single.defs = `<style>
                                                        .{randId} .bft-edit-form-header, .{randId} .bft-img-button{
                                                            background-color: #aeaeae;
                                                        }
                                                        .{randId}.male .bft-edit-form-header, .{randId}.male .bft-img-button{
                                                            background-color: #6bb4df;
                                                        }        
                                                        .{randId}.male div.bft-img-button:hover{
                                                            background-color: #cb4aaf;
                                                        }
                                                        .{randId}.female .bft-edit-form-header, .{randId}.female .bft-img-button{
                                                            background-color: #cb4aaf;
                                                        }        
                                                        .{randId}.female div.bft-img-button:hover{
                                                            background-color: #6bb4df;
                                                        }
                    </style>`;
                    FamilyTree.templates.single.node =
                        '<circle cx="100" cy="100" r="100" fill="white" stroke-width="1" stroke="#aeaeae"></circle>';
                    FamilyTree.templates.single.field_0 = '<text ' + FamilyTree.attr.width + ' ="160" style="font-size: 14px;" font-variant="all-small-caps"  font-weight="bold" fill="black" x="100" y="115" text-anchor="middle">{val}</text>';
                    FamilyTree.templates.single.field_1 = '<text ' + FamilyTree.attr.width + ' ="190" data-text-overflow="multiline" style="font-size: 16px;" fill="black" x="100" y="135" text-anchor="middle">{val}</text>';
                    FamilyTree.templates.single.field_3 =
                        '<text ' + FamilyTree.attr.width + ' ="60" style="font-size: 12px;" fill="black" x="100" y="180" text-anchor="middle">{val}</text>';
                    FamilyTree.templates.single.nodeMenuButton = `<use ${FamilyTree.attr.control_node_menu_id}="{id}" x="89" y="5" xlink:href="#base_node_menu" />`;





                    var family = new FamilyTree(tree, {


                        template: "main",
                        enableSearch: false,
                        nodeBinding: {
                            field_0: "relation",
                            field_1: "name"
                        },
                        nodeMenu: {
                            details: { text: "Details" },
                            edit: { text: "Edit" },
                            add: {
                                text: "Add",
                                onClick: function (node: string) {
                                    $(".ct_custom_modal_120").show(500)

                                    localStorage.setItem("selectedNode", node)
                                }
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
                                { type: 'textbox', label: 'Category', binding: 'relation' }
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

                        var nodeData = family.get(nodeId);
                        const formData = new URLSearchParams();
                        formData.append('id', nodeData['id'].toString());
                        formData.append('family_id', nodeData['family_id'].toString());

                        fetch('http://13.200.247.29:4000/deleteNode', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded'
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
                        var updateNode = args.updateNodesData[0];
                        console.log(updateNode);

                        fetch('http://13.200.247.29:4000/UpdateChildInTree', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded'
                            },
                            body: JSON.stringify(updateNode)
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
            },
        })
    };

    showBasicDialog() {
        this.displayBasic = true;
    };

    onSubmit(data) {

        const getSelectedNode = localStorage.getItem("selectedNode");
        const nodeForm = new URLSearchParams();
        if(this.facilityTab == true){
            nodeForm.set('facility_name', data.value.facility_name);
        }
        
        nodeForm.set('id', getSelectedNode);
        nodeForm.set('family_id', this.selectedTemplateId.toString());
        nodeForm.set('main_name', data.value.nodetype);
        nodeForm.set('name', data.value.nodeSubtitle);

        this.familyService.createChildTree(nodeForm.toString()).subscribe({
            next: res => {

                $(".ct_custom_modal_120").hide()
                this.nodeForm.reset();
                this.facilityTab = false;
                this.getTreeViewByID(this.selectedTemplateId);
            },
            error: err =>
                console.log(err)
        })
    };







}
