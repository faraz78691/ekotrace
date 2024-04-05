import { Component } from '@angular/core';
import FamilyTree from '@balkangraph/familytree.js';

@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.scss']
})
export class TreeComponent {


  ngOnInit() {
    const tree = document.getElementById('tree');
    if (tree) {
        var family = new FamilyTree(tree, {
            nodeBinding: {
            field_0: "name",
            field_1: "relation",
            },
        });

         family.load([
            // { id: 1, pids: [2], name: "Amber McKenzie", gender: "female", img: "https://cdn.balkan.app/shared/2.jpg"  },
            // { id: 2, pids: [1], name: "Ava Field", gender: "male", img: "https://cdn.balkan.app/shared/m30/5.jpg" },
            // { id: 3, mid: 1, fid: 2, name: "Peter Stevens", gender: "male", img: "https://cdn.balkan.app/shared/m10/2.jpg" },
            // { id: 4, mid: 1, fid: 2, name: "Savin Stevens", gender: "male", img: "https://cdn.balkan.app/shared/m10/1.jpg"  },
            // { id: 5, mid: 1, fid: 2, name: "Emma Stevens", gender: "female", img: "https://cdn.balkan.app/shared/w10/3.jpg" }
            {id: 1,
              name: "Reliance",
              gender: "male",
              relation: "Head of the Family's "
          },
          {
              id: 2,
              name: "Corporate Emissions",
              gender: "male",
              fid: 1,
              relation: "Reliance's "
          },
          {
              id: 3,
              name: "Facility",
              gender: "male",
              fid: 2,
              relation: "Corporate Emissions's "
          },
          {
              id: 4,
              name: "Office",
              gender: "male",
              fid: 2,
              relation: "Corporate Emissions's "
          },
          {
              id: 5,
              name: "Office2",
              gender: "male",
              fid: 2,
              relation: "Corporate Emissions's "
          }
        ]);
    }
};


}
