/*global d3*/
var JSPY_TRANSFORM = function () {
    "use strict";

    function stitchData(oldData, delta) {
        var actualElementLength = 3,
            lastElement = [],
            firstUpdate = [];
        if (oldData.length > 0 && lastElement.length < actualElementLength) {
            lastElement = oldData[oldData.length - 1];
            if (delta.length > 0) {
                firstUpdate = delta.shift();
                lastElement.concat(firstUpdate);
                oldData.concat(lastElement, delta);
            }
        }
        return oldData;
    }

    function buildTree(existingData, delta) {

        var data = [],
            stream = stitchData(existingData, delta),
            result = {dataSet: stream, tree: {}},
            parentId = 0,
            id = 1,
            lines = stream.split("\n");
        lines.forEach(function (line, index) {
            var elements = line.split(" "),
                node = {};
            if (elements.length > 0) {
                if (index === 0) {
                    node = {id: id, className: elements[1], methodName: elements[2], parentId: parentId};
                    data.push(node);
                }
                if (index >= 1) {
                    if (elements[0] === "start") {
                        parentId = parentId + 1;
                        id = id + 1;
                        node = {id: id, className: elements[1], methodName: elements[2], parentId: parentId, children: []};
                        data.push(node);
                    } else if (elements[0] === "end") {
                        parentId = parentId - 1;
                    }
                }
            }
        });
        data.forEach(function (elem) {
            elem.children = data.filter(function (entry) {
                return entry.parentId === elem.id;
            });
        });
        result.tree = data[0];
        console.log(result);
        return result;
    }


    return {
        buildTreeFromFlatData: buildTree
    };

}();