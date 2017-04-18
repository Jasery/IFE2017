//Dom Function 
function addClass(element, className) {
    var oldClassName = element.className;
    if(!oldClassName) {
        element.className = className;
    } else {
        element.className = oldClassName + " " + className;
    }
}
function removeClass(element, className) {
    var oldClassName = element.className;
    var newClassName = oldClassName.replace(" " + className,"");
    element.className = newClassName;
}

function swap(array, firstIndex, lastIndex) {
    var temp = array[firstIndex];
    array[firstIndex] = array[lastIndex];
    array[lastIndex] = temp;
}

//冒泡排序
function bubbleSort(array) {
    var len = array.length;
    for(var i = 0; i < len; i++) {
        for(var j = 0; j < len - i -1; j++) {
            if(array[j] > array[j+1]) {
                swap(array, j, j+1);
            }
        }
    }
    return array;
}

function bubbleSortAnimate(array, sortanimate) {
    var len = array.length;
    sortanimate.activeFragment(0,len);
    for(var i = 0; i < len; i++) {
        for(var j = 0; j < len - i; j++) {
            sortanimate.activeOne(j);
            if(array[j] > array[j+1]) {
                sortanimate.exchange(j, j+1);
                swap(array, j, j+1);
            }
            sortanimate.blurOne(j);
        }        
    }
    sortanimate.blurFragment(0,len);
}

//动画对象封装
function SortAnimate(array, wrapper) {
    this.array = array.slice();
    this.max = Math.max.apply(Math, array);
    this.ui = {
        columns:[],
        wrapper: wrapper || document.body
    };
    this.animate = [];
    this.index = -1;
    this.init();
}


function randomArray(len) {
    len = len || 10;
    var arr = [];
    for(var i = 0; i < len; i++) {
        arr.push(i);
    }
    arr.sort(function() {
        return Math.random() - 0.5;
    });
    return arr;
}

function playSortAnimate(method, arrLen) {
    var arr = randomArray(arrLen);
    var sortAnimate = new SortAnimate(arr, document.getElementById("sortAnimateWrap"));
    bubbleSortAnimate(arr, sortAnimate);
    sortAnimate.play(500);
}

window.onload = function () {
    playSortAnimate(bubbleSortAnimate, 10);
}

SortAnimate.prototype = {
    init: function () {
        var html = "";
        for(var i = 0; i < this.array.length; i++) {
            html += this.getColumn(this.array[i]);
        }
        this.html = html;

        this.ui.wrapper.innerHTML = this.html;
        this.ui.columns = this.ui.wrapper.getElementsByClassName("column");
    },
    getColumn: function (num) {
        return '<div class="column" style="height:' + this.getHeight(num) + '%;" title="' + num+ '" ></div>';
    },
    getHeight: function(num) {
        return parseInt(num/this.max*100);
    },
    uiExchange: function(index1, index2) {
        var temp = this.array[index1];
        this.array[index1] = this.array[index2];
        this.array[index2] = temp;

        this.uiSetHight(index1);
        this.uiSetHight(index2);
    },
    uiSetHight: function(index) {
        var num = this.array[index];
        this.ui.columns[index].style.height = this.getHeight(num) + "%";
        this.ui.columns[index].title = num;
    },
    uiHightLight: function(index1, index2) {
        debugger
        addClass(this.ui.columns[index1], "hightlight");
        addClass(this.ui.columns[index2], "hightlight");
    },
    uiUnHightLight: function(index1, index2) {
        removeClass(this.ui.columns[index1], "hightlight");
        removeClass(this.ui.columns[index2], "hightlight");
    },
    uiActiveOne: function(index) {
        addClass(this.ui.columns[index],"focus");
    },
    uiBlurOne: function(index) {
        removeClass(this.ui.columns[index], "focus");
    },
    uiActiveFragment: function(startIndex, endIndex) {
        this.startIndex = startIndex;
        this.endIndex = endIndex;
        for(var i = startIndex; i < endIndex; i++) {
            addClass(this.ui.columns[i],"active");
        }
    },
    uiBlurFragment: function(startIndex, endIndex) {
        startIndex = startIndex || this.startIndex;
        endIndex = endIndex || this.endIndex;
        for(var i = startIndex; i < endIndex; i++) {
            removeClass(this.ui.columns[i], "active");
        }
    },
    activeOne: function (index) {
        this.animate.push({
            type: 'uiActiveOne',
            data:[index]
        });
    },
    blurOne: function(index) {
        this.animate.push({
            type:"uiBlurOne",
            data:[index]
        });
    },
    activeFragment: function(startIndex, endIndex) {
        startIndex = startIndex < 0 ? 0 : startIndex;
        this.animate.push({
            type: "uiActiveFragment",
            data: [startIndex, endIndex]
        });
    },
    blurFragment: function(startIndex, endIndex) {
        startIndex = startIndex > 0 ? startIndex: 0;
        this.animate.push({
            type: "uiBlurFragment",
            data: [startIndex, endIndex]
        });
    },
    hightlight: function(index1, index2) {
        this.animate.push({
            type: "uiHightLight",
            data: [index1, index2]
        });
    },
    unHightlight: function(index1, index2) {
        this.animate.push({
            type: "uiUnHightLight",
            data: [index1, index2]
        });
    },
    exchange: function(index1, index2) {
        this.hightlight(index1, index2);
        this.unHightlight(index1, index2);

        this.animate.push({
            type: "uiExchange",
            data: [index1, index2]
        });
    },
    play: function (speed) {
        clearInterval(SortAnimate.intgerid);
        this.speed = speed || this.speed;
        var animate = this.animate;
        var len = animate.length;
        var self = this;
        SortAnimate.interid = setInterval(function () {
            self.index++;
            if(self.index < len) {
                self[animate[self.index].type].apply(self,animate[self.index].data);
            } else {
                clearInterval(SortAnimate.interid);
            }
        }, this.speed);
    }    
}