
function addClass(element, className) {
    var oldClassName = element.className,
        newClassName;
    if(!oldClassName) {
        newClassName = className;
    } else {
        newClassName = oldClassName + " " + className;
    }
    element.className = newClassName;
}
function removeClass(element, className) {
    var oldClassName = element.className,
        newClassName;
    if(oldClassName) {
        newClassName = oldClassName.replace(className,"");
        element.className = newClassName;
    }
}

function domBFS(element, callback) {
    var currentNode = element;
    var queue = [];

    while(currentNode) {
        for(var i = 0, length = currentNode.childNodes.length; i < length; i++) {
            if(currentNode.childNodes[i].nodeType === 1) {
                queue.push(currentNode.childNodes[i]);
            }
        }
        callback(currentNode);
        currentNode = queue.shift();
    }
}

function domDFS(element, callback) {
    
    (function traversal(currentNode) {
        for(var i = 0, length = currentNode.childNodes.length; i < length; i++) {
            if(currentNode.childNodes[i].nodeType === 1) {
                traversal(currentNode.childNodes[i]);
            }
        }
        callback(currentNode);
    })(element);
}

function displayTraversal(domList) {
    var count = 0;
    var intervalID = setInterval(function() {
        var currentNode = domList[count];
        addClass(currentNode, "active");
        if(count > 0) {
            removeClass(domList[count-1], "active");
        }
        count++;
        if(count >= domList.length) {
            clearInterval(intervalID);
            alert("遍历完成！");
            removeClass(domList[count-1], "active");
        }
    },1000);
}

window.onload = function() {
    var btnDFS = document.getElementById("DFS");
    btnDFS.addEventListener("click", function() {
        var content = document.getElementById("content");
        var domList = [];
        domDFS(content, function(node) {
            domList.push(node);
        });
        displayTraversal(domList);
    });

    var btnBFS = document.getElementById("BFS");
    btnBFS.addEventListener("click", function() {
        var content = document.getElementById("content");
        var domList = [];
        domBFS(content, function(node) {
            domList.push(node);
        });
        displayTraversal(domList);
    });
}






