import { useState } from 'react';
import { CHAPTERS_N, SEM_PARAMS } from '../constants/scheduleN';
import { useNavigate } from 'react-router-dom';

export const useEmbForm = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [saving, setSaving] = useState(false);
    const [showProjectModal, setShowProjectModal] = useState(false);
    const [assignment, setAssignment] = useState(null);
    const [form, setForm] = useState({ 
        title: '', 
        workCategory: '', 
        locationDescription: '', 
        gpsLat: '', gpsLng: '', 
        lineItems: [], 
        semChecklist: [], 
        photos: [], remarks: '' });
    // 🔹 generic setter
    const set = (key, value) => { setForm(prev => ({ ...prev, [key]: value })); };

    // ─────────────────────────────
    // 📍 GPS
    // ─────────────────────────────
    const captureGPS = () => {
        navigator.geolocation?.getCurrentPosition(
            (pos) => {
                set('gpsLat', pos.coords.latitude.toFixed(6));
                set('gpsLng', pos.coords.longitude.toFixed(6));
            },
            () => alert('GPS capture failed. Please enter manually.')
        );
    };

    // ─────────────────────────────
    // 📋 LINE ITEMS
    // ─────────────────────────────
    const addLine = () => {
        set('lineItems', [
            ...form.lineItems,
            {
                id: `li-${Date.now()}`,
                scheduleItem: '',
                itemCode: '',
                unit: '',
                description: '',
                measurements: [],
            },
        ]);
    };

    const removeLine = (id) => {
        set('lineItems', form.lineItems.filter(li => li.id !== id));
    };

    const updateLine = (id, key, val) => {
        console.log("Form Items",form.lineItems,id,key,val);
        set('lineItems',
            form.lineItems.map(li => {
                if (li.id !== id) return li;

                const updated = { ...li };

                // Schedule item selection
                if (key === 'scheduleItem') {
                    const item = CHAPTERS_N?.find((t)=>t.name===form.workCategory)?.items.find(
                        i => i.label === val
                    );

                    updated.scheduleItem = val;

                    if (item) {
                        updated.itemCode = item.code;
                        updated.unit = item.unit;
                        updated.measurements = item.measurements.map(dim => ({
                            ...dim,
                            value: null,
                        }));
                        if (!li.description) updated.description = val;
                    } else {
                        updated.itemCode = '';
                        updated.unit = '';
                        updated.measurements = [];
                    }

                    return updated;
                }

                // measurement update
                if (key.startsWith('measurement.')) {
                    const dimKey = key.split('.')[1];
                    updated.measurements = (li.measurements || []).map(dim =>
                        dim.key === dimKey ? { ...dim, value: val } : dim
                    );
                    return updated;
                }

                updated[key] = val;
                return updated;
            })
        );
    };

    // ─────────────────────────────
    // ☑️ SEM CHECKLIST
    // ─────────────────────────────
    const semParams = SEM_PARAMS[form.workCategory] || [];

    const toggleSem = (id) => {
        const exists = form.semChecklist.find(c => c.parameterId === id);

        if (exists) {
            set('semChecklist',
                form.semChecklist.map(c =>
                    c.parameterId === id ? { ...c, passed: !c.passed } : c
                )
            );
        } else {
            set('semChecklist', [
                ...form.semChecklist,
                { parameterId: id, passed: true },
            ]);
        }
    };

    const isSemPassed = (id) => {
        return form.semChecklist.find(c => c.parameterId === id)?.passed || false;
    };

    // ─────────────────────────────
    // 🚀 SUBMIT
    // ─────────────────────────────
    const doSubmit = async (asDraft = false) => {
        const payload = {
            project: assignment?.projectId,
            span: assignment?.spanId,
            status: asDraft ? 'DRAFT' : 'PENDING',
            title: form.title,
            workCategory: form.workCategory,
            locationDescription: form.locationDescription,
            remarks: form.remarks,
            pointLocation: {
                coordinates: {
                    lng: form.gpsLng,
                    lat: form.gpsLat,
                },
            },
            photos: form.photos.map(p => ({
                url: p.url,
                caption: p.caption,
                pointLocation: {
                    coordinates: {
                        gpsLat: p.gpsLat,
                        gpsLng: p.gpsLng,
                    },
                },
            })),
            semChecklist: semParams.map(p => ({
                parameterId: p.id,
                passed: isSemPassed(p.id),
            })),
            measurements: form.lineItems,
        };

        console.log('payload:', payload);

        setSaving(true);
        await new Promise(r => setTimeout(r, 800));
        setSaving(false);

        navigate('/my-entries');
    };

    const handleSubmit = async (asDraft = false) => {
        if (!assignment) {
            handleSubmit._pendingDraft = asDraft;
            setShowProjectModal(true);
            return;
        }
        await doSubmit(asDraft);
    };

    const confirmAssignment = (result) => {
        setAssignment(result);
        setShowProjectModal(false);
        if (handleSubmit._pendingDraft !== undefined) handleSubmit(handleSubmit._pendingDraft);
    };

    return {
        // state
        step,
        setStep,
        saving,
        form,
        semParams,
        // modal
        showProjectModal,
        setShowProjectModal,
        confirmAssignment,
        // setters
        set,
        // actions
        captureGPS,
        addLine,
        removeLine,
        updateLine,
        toggleSem,
        isSemPassed,
        handleSubmit,
    };
};