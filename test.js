let tool = require('./index');

let logger = tool.getLogger({});

let prgNameDefault = tool.getPrgName();
let prgNameManual = tool.getPrgName('testIkits');

let strictString = tool.isBasic('string');
let strictNumber = tool.isBasic('123456');
let strictBoolean = tool.isBasic(true);
let strictNull = tool.isBasic(null);
let strictUndefined = tool.isBasic(undefined);

let notStrictNull = tool.isBasic(null, true);
let notStrictUndefined = tool.isBasic(undefined, true);

let enableType1 = {};
tool.enable(enableType1, 'property', 1, 'initValue');

let curValue = enableType1.property();
let setValue = enableType1.property('setValue');

let enableType2 = {};
tool.enable(enableType2, 'propertySet', 2, {});
let curPropertySet = enableType2.propertySet();
enableType2.propertySet('addProperty', 'addPropertyValue');
let getPropertyValueFromPropertySet = enableType2.propertySet('addProperty');

//keep master value,fill slave value
let fillJsonMaster = {
    commonBasic: 'commonBasicMaster',
    commonObj: {
        commonBasic2: 'commonBasicMaster2',
        commonObj2: {
            commonBasic3: 'commonBasicMaster3',
            singleBasic3: 'singleBasicMaster3'
        },
        singleBasic2: 'singleBasicMaster2',
        singleObj2: {
        }
    },
    singleBasic: 'singleBasicMaster',
    singleObj: {
        singleBasic2: 'singleBasicMaster2'
    }
};

let fillJsonSlave = {
    commonBasic: 'commonBasicSlave',
    commonObj: {
        commonBasic2: 'commonBasicSlave2',
        commonObj2: {
            commonBasic3: 'commonBasicSlave3',
            singleBasic3: 'singleBasicSlave3'
        },
        singleBasic2: 'singleBasicSlave2',
        singleObj2: {
        }
    },
    singleBasic: 'singleBasicSlave',
    singleObj: {
        singleBasic2: 'singleBasicSlave2'
    }
};

tool.fillJson(fillJsonMaster,fillJsonSlave);






