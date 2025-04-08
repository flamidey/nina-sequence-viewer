document.getElementById('fileInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const json = JSON.parse(e.target.result);
            displaySequence(json);
        } catch (error) {
            document.getElementById('output').innerHTML = '<p style="color: red;">Error: Invalid JSON file</p>';
        }
    };
    reader.readAsText(file);
});

// Add event listeners for global Collapse All and Expand All buttons
document.getElementById('collapseAll').addEventListener('click', function() {
    document.querySelectorAll('.content').forEach(content => {
        content.style.display = 'none';
    });
    document.querySelectorAll('.toggle-btn').forEach(btn => {
        btn.textContent = '+';
    });
});

document.getElementById('expandAll').addEventListener('click', function() {
    document.querySelectorAll('.content').forEach(content => {
        content.style.display = 'block';
    });
    document.querySelectorAll('.toggle-btn').forEach(btn => {
        btn.textContent = '-';
    });
});

function displaySequence(json) {
    const output = document.getElementById('output');
    output.innerHTML = ''; // Clear previous content

    // Display the sequence name
    const sequenceName = json.Name || 'Unnamed Sequence';
    output.innerHTML += `<h2>${sequenceName}</h2>`;

    // Process items recursively
    if (json.Items && json.Items.$values) {
        json.Items.$values.forEach(item => {
            output.appendChild(createSection(item));
        });
    }

    // Display triggers if they exist and are not empty
    if (json.Triggers && json.Triggers.$values && json.Triggers.$values.length > 0) {
        const triggersDiv = createSection({
            Name: 'Triggers',
            $type: 'TriggersContainer',
            Items: { $values: json.Triggers.$values } // Ensure Items is passed correctly
        }, 1);
        output.appendChild(triggersDiv);
    }
}

function createSection(item, level = 0) {
    const div = document.createElement('div');
    div.className = 'section';
    div.style.marginLeft = `${level * 10}px`; // Reduced indentation
    div.style.marginBottom = '3px'; // Minimal margin
    div.style.marginTop = '1px';
    div.style.padding = '0'; // No padding
    div.style.border = '1px solid #ccc';
    div.style.borderRadius = '3px';

    // Determine the section type for color coding
    let sectionType = 'Default';
    if (item.$type.includes('Trigger') || item.$type === 'TriggersContainer') {
        sectionType = 'Trigger';
    } else if (item.$type.includes('Condition') || item.$type === 'ConditionsContainer') {
        sectionType = 'Condition';
    } else if (item.$type === 'CustomEventContainer' || item.$type.endsWith('InstructionsContainer')) {
        sectionType = item.$type;
    } else if (item.$type.includes('TargetSchedulerContainer')) {
        sectionType = 'TargetScheduler';
    }
    div.setAttribute('data-type', sectionType);

    // Determine the icon and name based on the item type
    let icon = '📋'; // Default icon for generic items
    let name = item.Name || item.$type.split('.').pop().replace(/, .*$/, ''); // Fallback name

    // IMPORTANT FIX: Handle special cases for display names first
    if (item.$type.toLowerCase().includes('whenswitch')) {
        name = 'When';
    } else if (item.$type.toLowerCase().includes('whenunsafe')) { 
        name = 'When Becomes Unsafe';
    } else if (item.$type.toLowerCase().includes('ifconstant')) {
        name = 'If';
    }
    // Then proceed with the rest of the type checks
    else if (item.$type.includes('Container')) {
        icon = '📦';
    } else if (item.$type.includes('Trigger') || item.$type === 'TriggersContainer') {
        icon = '⚡';
        if (item.$type.includes('FailuresToPushoverTrigger')) {
            name = 'Failures to Pushover';
        } else if (item.$type.includes('MeridianFlipTrigger')) {
            name = 'Meridian Flip';
        } else if (item.$type.includes('AutofocusAfterHFRIncreaseTrigger')) {
            name = 'Autofocus After HFR Increase';
        } else if (item.$type.includes('CenterAfterDriftTrigger')) {
            name = 'Center After Drift';
        } else if (item.$type.includes('RestoreGuiding')) {
            name = 'Restore Guiding';
            icon = '🔄';
        } else if (item.$type.includes('GSSend')) {
            name = 'StarMessenger';
        } else if (item.$type.includes('StarMessenger')) {
            name = 'StarMessenger';
        } else if (item.$type.includes('OnceSafe')) {
            name = 'Once Safe';
        }
    } else if (item.$type.includes('Condition') || item.$type === 'ConditionsContainer') {
        icon = '🔄';
        if (item.$type.includes('LoopCondition')) {
            name = 'Loop Condition';
        } else if (item.$type.includes('TimeCondition')) {
            name = 'Time Condition';
        } else if (item.$type.includes('TargetSchedulerCondition')) {
            name = 'Target Scheduler Condition';
        } else if (item.$type.includes('TargetSchedulerBackgroundCondition')) {
            name = 'Target Scheduler Background Condition';
        } else if (item.$type.includes('Stars')) {
            name = 'StarMessenger';
        } else if (item.$type.includes('LoopWhile')) {
            name = 'Loop While';
        } else if (item.$type.includes('ExpressionCondition')) {
            name = 'Expression';
        } else if (item.$type.includes('SafetyMonitorCondition')) {
            name = 'Safety Monitor Condition';
        }
    } else if (item.$type.includes('WaitForTime') || item.$type.includes('WaitForTimeSpan')) {
        icon = '⏰';
        name = item.$type.includes('WaitForTime') ? 'Wait for Time' : 'Wait for Time Span';
    } else if (item.$type.includes('CoolCamera')) {
        icon = '❄️';
        name = 'Cool Camera';
    } else if (item.$type.includes('WarmCamera')) {
        icon = '❄️';
        name = 'Warm Camera';
    } else if (item.$type.includes('OpenCover')) {
        icon = '🔲';
        name = 'Open Flat Panel Cover';
    } else if (item.$type.includes('CloseCover')) {
        icon = '🔲';
        name = 'Close Flat Panel Cover';
    } else if (item.$type.includes('UnparkScope')) {
        icon = '🔭';
        name = 'Unpark Scope';
    } else if (item.$type.includes('ParkScope')) {
        icon = '🔭';
        name = 'Park Scope';
    } else if (item.$type.includes('SwitchFilter')) {
        icon = '🎨';
        name = 'Switch Filter';
    } else if (item.$type.includes('SendToPushover')) {
        icon = '📢';
        name = 'Send to Pushover';
    } else if (item.$type.includes('SendToMqtt')) {
        icon = '📢';
        name = 'Publish to MQTT Broker';
    } else if (item.$type.includes('Annotation')) {
        icon = '📝';
        name = 'Annotation';
    } else if (item.$type.includes('DeviceActionInstruction')) {
        icon = '⚙️';
        name = 'Device Action';
    } else if (item.$type.includes('DisconnectAllEquipment')) {
        icon = '🔌';
        name = 'Disconnect All Equipment';
    } else if (item.$type.includes('SaveSequence')) {
        icon = '💾';
        name = 'Save Sequence';
    } else if (item.$type.includes('ToggleLight')) {
        icon = '💡';
        name = 'Toggle Light';
    } else if (item.$type.includes('AddImagePattern')) {
        icon = '🖼️';
        name = 'Add Image Pattern';
    } else if (item.$type.includes('SetGlobalVariable')) {
        icon = '🌐';
        name = 'Set Global Variable';
    } else if (item.$type.includes('TargetSchedulerContainer')) {
        icon = '🎯';
        name = 'Target Scheduler Container';
    } else if (item.$type.includes('TargetSchedulerFlats')) {
        icon = '📸';
        name = 'Target Scheduler Flats';
    } else if (item.$type.includes('StopGuiding')) {
        icon = '🛑';
        name = 'Stop Guiding';
    } else if (item.$type.includes('SetTracking')) {
        icon = '🌌';
        name = 'Set Tracking';
    } else if (item.$type.includes('RunAutofocus')) {
        icon = '🔍';
        name = 'Run Autofocus';
    }

    // Create the section header with a toggle button
    const header = document.createElement('div');
    header.className = 'section-header';
    header.style.padding = '2px 5px'; // Minimize padding
    header.style.height = '22px'; // Force compact height
    header.style.lineHeight = '22px';
    
    const toggleBtn = document.createElement('span');
    toggleBtn.className = 'toggle-btn';
    toggleBtn.textContent = '-'; // Start expanded
    toggleBtn.style.fontSize = '12px'; // Smaller font
    toggleBtn.style.marginRight = '4px'; // Less spacing
    header.appendChild(toggleBtn);
    
    // Add icon and name
    const iconSpan = document.createElement('span');
    iconSpan.className = 'icon';
    iconSpan.innerHTML = icon;
    iconSpan.style.fontSize = '14px';
    iconSpan.style.marginRight = '5px';
    
    const nameH2 = document.createElement('h2');
    nameH2.innerHTML = name;
    nameH2.style.fontSize = '14px';
    nameH2.style.margin = '0';
    nameH2.style.padding = '0';
    nameH2.style.display = 'inline-block';
    
    header.appendChild(iconSpan);
    header.appendChild(nameH2);

    // Create the content div (collapsible area)
    const contentDiv = document.createElement('div');
    contentDiv.className = 'content';
    contentDiv.style.padding = '3px 6px'; // Minimal padding
    contentDiv.style.margin = '0'; // No margin

    // Add container-level Collapse All and Expand All buttons if there are nested sections
    let hasNestedSections = false;
    const nestedSections = [];
    const containerControls = document.createElement('div');
    containerControls.className = 'container-controls';
    containerControls.style.margin = '0';
    containerControls.style.padding = '0';
    containerControls.style.height = '14px';

    const collapseBtn = document.createElement('button');
    collapseBtn.className = 'control-btn';
    collapseBtn.innerHTML = '−';
    collapseBtn.style.fontSize = '9px';
    collapseBtn.style.padding = '0 2px';
    collapseBtn.style.margin = '0';
    collapseBtn.style.height = '12px';
    collapseBtn.style.lineHeight = '12px';
    collapseBtn.addEventListener('click', () => {
        nestedSections.forEach(section => {
            const sectionContent = section.querySelector('.content');
            const sectionToggleBtn = section.querySelector('.toggle-btn');
            if (sectionContent) sectionContent.style.display = 'none';
            if (sectionToggleBtn) sectionToggleBtn.textContent = '+';
        });
    });

    const expandBtn = document.createElement('button');
    expandBtn.className = 'control-btn';
    expandBtn.innerHTML = '+';
    expandBtn.style.fontSize = '9px';
    expandBtn.style.padding = '0 2px';
    expandBtn.style.margin = '0';
    expandBtn.style.height = '12px';
    expandBtn.style.lineHeight = '12px';
    expandBtn.addEventListener('click', () => {
        nestedSections.forEach(section => {
            const sectionContent = section.querySelector('.content');
            const sectionToggleBtn = section.querySelector('.toggle-btn');
            if (sectionContent) sectionContent.style.display = 'block';
            if (sectionToggleBtn) sectionToggleBtn.textContent = '-';
        });
    });

    // Map numeric values to human-readable strings for Priority and NotificationSound
    const priorityMap = {
        0: 'Normal',
        2: 'EMERGENCY'
    };
    const notificationSoundMap = {
        0: 'Default',
        1: 'PUSHOVER', // Updated mapping for NotificationSound: 1
        5: 'None',
        22: 'PUSHOVER'
    };

    // Display key details based on item type
    let details = '';
    if (item.Hours || item.Minutes || item.Seconds) {
        const timeSource = item.SelectedProvider?.$type?.includes('NauticalDusk') ? 'Nautical Dusk' : 
                          item.SelectedProvider?.$type?.includes('NauticalDawn') ? 'Nautical Dawn' : 
                          item.SelectedProvider?.$type?.includes('Sunrise') ? 'Sunrise' : 'Unknown';
        details += `<p>Wait for Time: ${item.Hours || 0}h ${item.Minutes || 0}m ${item.Seconds || 0}s (Source: ${timeSource}, Offset: ${item.MinutesOffset || 0}m)</p>`;
    } else if (item.$type.includes('WaitForTimeSpan') && (item.Seconds !== undefined || item.Time !== undefined)) {
        const timeValue = item.Time !== undefined ? item.Time : item.Seconds;
        details += `<p>Wait for Time Span: ${timeValue}s</p>`;
    }
    if (item.Temperature) {
        details += `<p>Temperature: ${item.Temperature}°C</p>`;
    }
    if (item.Duration) {
        details += `<p>Duration: ${item.Duration} minutes</p>`;
    }
    if (item.Filter && item.Filter._name) {
        details += `<p>Filter: ${item.Filter._name}</p>`;
    }
    if (item.Text) {
        details += `<p>Note: ${item.Text}</p>`;
    }
    if (item.Message) {
        details += `<p>Message: ${item.Message}</p>`;
    }
    if (item.Title) {
        details += `<p>Title: ${item.Title}</p>`;
    }
    if (item.TrackingMode !== undefined) {
        const trackingModeMap = {
            0: 'SIDEREAL',
            5: 'STOPPED'
        };
        details += `<p>Tracking rate: ${trackingModeMap[item.TrackingMode] || item.TrackingMode}</p>`;
    }
    if (item.OnOff !== undefined) {
        details += `<p>Toggle Light: ${item.OnOff ? 'On' : 'Off'}</p>`;
    }
    if (item.Coordinates) {
        const coords = item.Coordinates;
        if (coords.AzDegrees !== undefined) {
            details += `<p>Coordinates: Az ${coords.AzDegrees}° ${coords.AzMinutes}' ${coords.AzSeconds}", Alt ${coords.AltDegrees}° ${coords.AltMinutes}' ${coords.AltSeconds}"</p>`;
        } else if (coords.RAHours !== undefined) {
            details += `<p>Coordinates: RA ${coords.RAHours}h ${coords.RAMinutes}m ${coords.RASeconds}s, Dec ${coords.NegativeDec ? '-' : ''}${coords.DecDegrees}° ${coords.DecMinutes}' ${coords.DecSeconds}"</p>`;
        }
    }
    if (item.Priority !== undefined) {
        details += `<p>Priority: ${priorityMap[item.Priority] || item.Priority}</p>`;
    }
    if (item.Sound !== undefined) {
        details += `<p>Sound: ${notificationSoundMap[item.Sound] || item.Sound}</p>`;
    } else if (item.NotificationSound !== undefined) {
        details += `<p>Notification Sound: ${notificationSoundMap[item.NotificationSound] || item.NotificationSound}</p>`;
    }
    if (item.AfterExposures !== undefined) {
        details += `<p>After exposures: ${item.AfterExposures}</p>`;
    }

    // Handle expressions for different component types
    if (item.$type.toLowerCase().includes('ifconstant')) {
        if (item.IfExpr && item.IfExpr.Expression) {
            details += `<p>Expression: ${item.IfExpr.Expression}</p>`;
        }
    } else if (item.Expr && item.Expr.Expression) {
        details += `<p>Expression: ${item.Expr.Expression}</p>`;
        if (item.PatternDescription) {
            details += `<p>Description: ${item.PatternDescription}</p>`;
        }
    }

    if (item.$type.includes('LoopWhile') && item.PredicateExpr && item.PredicateExpr.Expression) {
        details += `<p>Expression: ${item.PredicateExpr.Expression}</p>`;
    }

    // Add support for WhenSwitch Expression (check IfExpr)
    if (item.$type.toLowerCase().includes('whenswitch')) {
        if (item.IfExpr && item.IfExpr.Expression) {
            details += `<p>Expression: ${item.IfExpr.Expression}</p>`;
        } else if (item.Expression) {
            details += `<p>Expression: ${item.Expression}</p>`;
        } else if (item.Condition && item.Condition.Expression) {
            details += `<p>Expression: ${item.Condition.Expression}</p>`;
        }
    }
    
    // Add support for ExpressionCondition
    if (item.$type.includes('ExpressionCondition') && item.Expression) {
        details += `<p>Expression: ${item.Expression}</p>`;
    }
    
    if (item.ActionName !== undefined) {
        details += `<p>Device Action: ${item.ActionName}</p>`;
    }
    if (item.$type.includes('GSSend') && item.Condition && item.Condition.Items && item.Condition.Items.$values) {
        const mqttItem = item.Condition.Items.$values.find(subItem => subItem.$type.includes('SendToMqtt'));
        if (mqttItem && mqttItem.Topic && mqttItem.Payload) {
            details += `<p>MQTT Topic: ${mqttItem.Topic}, Payload: ${mqttItem.Payload}</p>`;
        }
    } else if (item.Topic && item.Payload) {
        details += `<p>MQTT Topic: ${item.Topic}, Payload: ${item.Payload}</p>`;
    }
    if (item.$type.includes('SendStarMessageToPushoverByConditionTrigger') && item.Conditions && item.Conditions.$values) {
        item.Conditions.$values.forEach(condition => {
            if (condition.SelectedPropertyForCondition && condition.SelectedOperatorForCondition && condition.ValueForCondition) {
                const propName = condition.SelectedPropertyForCondition.PropertyUserFriendlyName || condition.SelectedPropertyForCondition.PropertyName;
                details += `<p>Condition: ${propName} ${condition.SelectedOperatorForCondition} ${condition.ValueForCondition}</p>`;
            }
        });
    }
    if (item.FlatCount) {
        details += `<p>Flat Count: ${item.FlatCount}</p>`;
    }
    if (item.FilePath) {
        details += `<p>File: ${item.FilePath}</p>`;
    }
    if (item.$type.includes('SetGlobalVariable')) {
        if (item.Name) {
            details += `<p>Name: ${item.Name}</p>`;
        }
        if (item.Initially) {
            details += `<p>Initially: ${item.Initially}</p>`;
        }
    }
    
    if (details) {
        const detailsDiv = document.createElement('div');
        detailsDiv.innerHTML = details;
        detailsDiv.style.margin = '0';
        detailsDiv.style.padding = '0';
        
        // Style all paragraphs for compact display
        setTimeout(() => {
            const paragraphs = detailsDiv.querySelectorAll('p');
            paragraphs.forEach(p => {
                p.style.margin = '2px 0';
                p.style.padding = '0';
                p.style.fontSize = '13px';
                p.style.lineHeight = '16px';
            });
        }, 0);
        
        contentDiv.appendChild(detailsDiv);
    }

    // Display conditions if they exist, but skip for SendStarMessageToPushoverByConditionTrigger
    if (item.Conditions && item.Conditions.$values && item.Conditions.$values.length > 0 && !item.$type.includes('SendStarMessageToPushoverByConditionTrigger')) {
        const conditionsDiv = createSection({
            Name: 'Conditions',
            $type: 'ConditionsContainer',
            Items: item.Conditions
        }, level + 1);
        contentDiv.appendChild(conditionsDiv);
        nestedSections.push(conditionsDiv);
        hasNestedSections = true;
    }

    // Display triggers if they exist and are not empty
    if (item.Triggers && item.Triggers.$values && item.Triggers.$values.length > 0) {
        const triggersDiv = createSection({
            Name: 'Triggers',
            $type: 'TriggersContainer',
            Items: { $values: item.Triggers.$values } // Ensure Items is passed correctly
        }, level + 1);
        contentDiv.appendChild(triggersDiv);
        nestedSections.push(triggersDiv);
        hasNestedSections = true;
    }

    // Display nested items for triggers like "When Becomes Unsafe" and "WHEN"
    if (item.Items && item.Items.$values && item.Items.$values.length > 0) {
        item.Items.$values.forEach(subItem => {
            const subItemDiv = createSection(subItem, level + 1);
            contentDiv.appendChild(subItemDiv);
            nestedSections.push(subItemDiv);
            hasNestedSections = true;
        });
    }

    // Check for Instructions as an alternative
    if (item.Instructions && item.Instructions.$values && item.Instructions.$values.length > 0) {
        item.Instructions.$values.forEach(subItem => {
            const subItemDiv = createSection(subItem, level + 1);
            contentDiv.appendChild(subItemDiv);
            nestedSections.push(subItemDiv);
            hasNestedSections = true;
        });
    }

    // Check for nested Items within Instructions
    if (item.Instructions && item.Instructions.Items && item.Instructions.Items.$values && item.Instructions.Items.$values.length > 0) {
        item.Instructions.Items.$values.forEach(subItem => {
            const subItemDiv = createSection(subItem, level + 1);
            contentDiv.appendChild(subItemDiv);
            nestedSections.push(subItemDiv);
            hasNestedSections = true;
        });
    }

    // Display custom event containers if they exist
    if (item.CustomEventContainers && item.CustomEventContainers.$values && item.CustomEventContainers.$values.length > 0) {
        const customEventsDiv = createSection({
            Name: 'Custom Event Containers',
            $type: 'CustomEventContainer',
            Items: item.CustomEventContainers
        }, level + 1);
        contentDiv.appendChild(customEventsDiv);
        nestedSections.push(customEventsDiv);
        hasNestedSections = true;
    }

    // Display Before Wait Instructions if they exist and are not empty
    if (item.BeforeWaitContainer && item.BeforeWaitContainer.Items && item.BeforeWaitContainer.Items.$values && item.BeforeWaitContainer.Items.$values.length > 0) {
        const beforeWaitDiv = createSection({
            Name: 'Before Wait Instructions',
            $type: 'BeforeWaitInstructionsContainer',
            Items: item.BeforeWaitContainer.Items
        }, level + 1);
        contentDiv.appendChild(beforeWaitDiv);
        nestedSections.push(beforeWaitDiv);
        hasNestedSections = true;
    }

    // Display After Wait Instructions if they exist and are not empty
    if (item.AfterWaitContainer && item.AfterWaitContainer.Items && item.AfterWaitContainer.Items.$values && item.AfterWaitContainer.Items.$values.length > 0) {
        const afterWaitDiv = createSection({
            Name: 'After Wait Instructions',
            $type: 'AfterWaitInstructionsContainer',
            Items: item.AfterWaitContainer.Items
        }, level + 1);
        contentDiv.appendChild(afterWaitDiv);
        nestedSections.push(afterWaitDiv);
        hasNestedSections = true;
    }

    // Display Before New Target Instructions if they exist and are not empty
    if (item.BeforeTargetContainer && item.BeforeTargetContainer.Items && item.BeforeTargetContainer.Items.$values && item.BeforeTargetContainer.Items.$values.length > 0) {
        const beforeNewTargetDiv = createSection({
            Name: 'Before New Target Instructions',
            $type: 'BeforeNewTargetInstructionsContainer',
            Items: item.BeforeTargetContainer.Items
        }, level + 1);
        contentDiv.appendChild(beforeNewTargetDiv);
        nestedSections.push(beforeNewTargetDiv);
        hasNestedSections = true;
    }

    // Display After Each Exposure Instructions if they exist and are not empty
    if (item.AfterEachExposureContainer && item.AfterEachExposureContainer.Items && item.AfterEachExposureContainer.Items.$values && item.AfterEachExposureContainer.Items.$values.length > 0) {
        const afterEachExposureDiv = createSection({
            Name: 'After Each Exposure Instructions',
            $type: 'AfterEachExposureInstructionsContainer',
            Items: item.AfterEachExposureContainer.Items
        }, level + 1);
        contentDiv.appendChild(afterEachExposureDiv);
        nestedSections.push(afterEachExposureDiv);
        hasNestedSections = true;
    }

    // Display After New Target Instructions if they exist and are not empty
    if (item.AfterNewTargetContainer && item.AfterNewTargetContainer.Items && item.AfterNewTargetContainer.Items.$values && item.AfterNewTargetContainer.Items.$values.length > 0) {
        const afterNewTargetDiv = createSection({
            Name: 'After New Target Instructions',
            $type: 'AfterNewTargetInstructionsContainer',
            Items: item.AfterNewTargetContainer.Items
        }, level + 1);
        contentDiv.appendChild(afterNewTargetDiv);
        nestedSections.push(afterNewTargetDiv);
        hasNestedSections = true;
    }

    // Display After Each Target Instructions if they exist and are not empty
    if (item.AfterEachTargetContainer && item.AfterEachTargetContainer.Items && item.AfterEachTargetContainer.Items.$values && item.AfterEachTargetContainer.Items.$values.length > 0) {
        const afterEachTargetDiv = createSection({
            Name: 'After Each Target Instructions',
            $type: 'AfterEachTargetInstructionsContainer',
            Items: item.AfterEachTargetContainer.Items
        }, level + 1);
        contentDiv.appendChild(afterEachTargetDiv);
        nestedSections.push(afterEachTargetDiv);
        hasNestedSections = true;
    }

    // Display After Target Complete Instructions if they exist and are not empty
    if (item.AfterTargetCompleteContainer && item.AfterTargetCompleteContainer.Items && item.AfterTargetCompleteContainer.Items.$values && item.AfterTargetCompleteContainer.Items.$values.length > 0) {
        const afterTargetCompleteDiv = createSection({
            Name: 'After Target Complete Instructions',
            $type: 'AfterTargetCompleteInstructionsContainer',
            Items: item.AfterTargetCompleteContainer.Items
        }, level + 1);
        contentDiv.appendChild(afterTargetCompleteDiv);
        nestedSections.push(afterTargetCompleteDiv);
        hasNestedSections = true;
    }

    // Add the container-level buttons if there are nested sections
    if (hasNestedSections) {
        containerControls.appendChild(collapseBtn);
        containerControls.appendChild(expandBtn);
        contentDiv.insertBefore(containerControls, contentDiv.firstChild);
    }

    // Add toggle functionality to the header
    header.addEventListener('click', () => {
        if (contentDiv.style.display === 'none') {
            contentDiv.style.display = 'block';
            toggleBtn.textContent = '-';
        } else {
            contentDiv.style.display = 'none';
            toggleBtn.textContent = '+';
        }
    });

    // Append the header and content to the section
    div.appendChild(header);
    div.appendChild(contentDiv);

    return div;
}