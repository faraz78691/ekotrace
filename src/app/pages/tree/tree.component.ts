
import { Component, ElementRef, Input, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import FamilyTree from '@balkangraph/familytree.js';
import { FamilyService } from '@services/family.service';
import { NotificationService } from '@services/notification.service';
import { TrackingService } from '@services/tracking.service';
import { ToastrService } from 'ngx-toastr';
import { InputTextModule } from 'primeng/inputtext';

declare var $: any;
@Component({
    selector: 'app-tree',
    templateUrl: './tree.component.html',
    styleUrls: ['./tree.component.scss']
})
export class TreeComponent {
    @ViewChild('nodeForm') nodeForm: any;
    @ViewChild('cancel2') hideModal: any
    nodeTitle: string;
    nodeSubtitle: string;
    selectedId: number;
    @Input() id!: string;
    selectedNode: number;
    loadFamilyData: any[] = [];
    constructor(
        private renderer: Renderer2,
        private route: ActivatedRoute,
        private router: Router,
        private trackingService: TrackingService,
        private notification: NotificationService,
        private toastr: ToastrService,
        private familyService: FamilyService
    ) {
        this.onRemove = this.onRemove.bind(this)
    }
    ngOnInit() {

        this.getTreeViewByID();

    };

    onCancel() {
        $(".ct_custom_modal_120").hide()
        const targetElement = document.getElementById('#cancel2');
        if (targetElement) {
            console.log('fd')
            this.renderer.addClass(targetElement, 'none');
        }
        this.hideModal.nativeElement

    }

    getTreeViewByID() {
        const formData = new URLSearchParams();
        formData.set('family_id', this.id);

        this.familyService.getTreeById(formData.toString()).subscribe({
            next(value) {
                this.loadFamilyData = value.familyTreeDetails
                const tree = document.getElementById('tree');
                if (tree) {

                    var family = new FamilyTree(tree, {
                        editForm: {
                            addMoreFieldName: null,
                            addMore: null,
                            addMoreBtn: null,
                            generateElementsFromFields: false,
                            elements: [
                                { type: 'textbox', label: 'Title', binding: 'relation' },
                                { type: 'textbox', label: 'Sub Title', binding: 'name' }
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
                        nodeContextMenu: {
                            details: { text: "Details" },
                            edit: { text: "Edit" },
                            add: { text: "Add" },
                            remove: { text: "Remove" },
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
                        nodeBinding: {
                            field_0: "name",
                            field_1: "relation",
                        },

                    });
                    function callHandler(nodeId) {
                        var nodeData = family.get(nodeId);
                        console.log(nodeData);
                        const formData = new URLSearchParams();
                        formData.append('id', nodeData['id'].toString());
                        formData.append('family_id', nodeData['family_id'].toString());

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



    onSubmit(data) {

        const getSelectedNode = localStorage.getItem("selectedNode");
        const nodeForm = new URLSearchParams();
        nodeForm.set('id', getSelectedNode);
        nodeForm.set('family_id', this.id);
        nodeForm.set('main_name', data.value.nodeTitle);
        nodeForm.set('name', data.value.nodeSubtitle);

        this.familyService.createChildTree(nodeForm.toString()).subscribe({
            next: res => {

                $(".ct_custom_modal_120").hide()
                this.nodeForm.reset()
                this.getTreeViewByID();
            },
            error: err =>
                console.log(err)
        })
    };


    onRemove(nodeid) {

        const nodeForm = new URLSearchParams();
        nodeForm.set('id', nodeid);
        nodeForm.set('family_id', this.id);

        this.familyService.deleteChildTree(nodeForm.toString()).subscribe({
            next: res => {

                this.nodeForm.reset()
                if (res.success) {
                    this.getTreeViewByID();
                }
            },
            error: err =>
                console.log(err)
        })
    };




}
