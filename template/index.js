module.exports = {
    typeclinet: (moduleName) => {
        return `
import React, { useState, useEffect } from 'react';
import './index.less';
import { Component, ComponentTransform, useApplicationContext, useComponent, useReactiveState } from '@typeclient/react';

@Component()
export class ${moduleName} implements ComponentTransform {
    render(props: any) {
        const ctx = useApplicationContext<>();

        return (<div>
            
        </div>);
    }
}
        `
    }
}