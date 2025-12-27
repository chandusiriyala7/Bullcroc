"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/toast";
import { Plus, Edit, Trash2, Loader2, GripVertical } from "lucide-react";

export default function CustomizationOptionsPage() {
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingOption, setEditingOption] = useState(null);
    const [formData, setFormData] = useState({
        type: 'font',
        name: '',
        value: '',
        priceModifier: 0,
        modifierType: 'fixed',
        isActive: true,
        previewData: {} // For storing extra data like hex, specific dimensions etc.
    });
    const { toast } = useToast();

    // Group options by type
    const groupedOptions = options.reduce((acc, option) => {
        if (!acc[option.type]) acc[option.type] = [];
        acc[option.type].push(option);
        return acc;
    }, {});

    const optionTypes = ['font', 'color', 'size', 'material', 'finish', 'backing', 'mounting'];

    useEffect(() => {
        fetchOptions();
    }, []);

    const fetchOptions = async () => {
        try {
            const response = await fetch('/api/admin/customization');
            if (response.ok) {
                const data = await response.json();
                setOptions(data.options);
            }
        } catch (error) {
            toast.error("Failed to load options");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const url = editingOption
                ? `/api/admin/customization/${editingOption._id}`
                : '/api/admin/customization';

            const method = editingOption ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                toast.success(editingOption ? "Option updated" : "Option created");
                fetchOptions();
                setIsDialogOpen(false);
                resetForm();
            } else {
                const data = await response.json();
                toast.error(data.message || "Operation failed");
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this option?')) return;

        try {
            const response = await fetch(`/api/admin/customization/${id}`, { method: 'DELETE' });
            if (response.ok) {
                toast.success("Option deleted");
                fetchOptions();
            } else {
                toast.error("Failed to delete");
            }
        } catch (error) {
            toast.error("Deletion error");
        }
    };

    const handleEdit = (option) => {
        setEditingOption(option);
        setFormData({
            type: option.type,
            name: option.name,
            value: option.value,
            priceModifier: option.priceModifier,
            modifierType: option.modifierType,
            isActive: option.isActive,
            previewData: option.previewData || {}
        });
        setIsDialogOpen(true);
    };

    const resetForm = () => {
        setEditingOption(null);
        setFormData({
            type: 'font',
            name: '',
            value: '',
            priceModifier: 0,
            modifierType: 'fixed',
            isActive: true,
            previewData: {}
        });
    };

    if (loading && !options.length) {
        return <div className="flex h-[50vh] items-center justify-center"><Loader2 className="animate-spin" /></div>;
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Customization Options</h1>
                    <p className="text-muted-foreground">Manage fonts, colors, sizes and materials</p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
                    <DialogTrigger asChild>
                        <Button><Plus className="h-4 w-4 mr-2" /> Add Option</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle>{editingOption ? "Edit Option" : "Add New Option"}</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="type">Type</Label>
                                <Select
                                    value={formData.type}
                                    onValueChange={(val) => setFormData({ ...formData, type: val })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {optionTypes.map(type => (
                                            <SelectItem key={type} value={type} className="capitalize">
                                                {type}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="name">Display Name</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="e.g., Arial, Red, Large"
                                    required
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="value">Value (CSS/Internal)</Label>
                                <Input
                                    id="value"
                                    value={formData.value}
                                    onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                                    placeholder="e.g., 'Courier New', #ff0000, 12x6"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="price">Price Modifier</Label>
                                    <Input
                                        id="price"
                                        type="number"
                                        value={formData.priceModifier}
                                        onChange={(e) => setFormData({ ...formData, priceModifier: parseFloat(e.target.value) })}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="modType">Modifier Type</Label>
                                    <Select
                                        value={formData.modifierType}
                                        onValueChange={(val) => setFormData({ ...formData, modifierType: val })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="fixed">Fixed (₹)</SelectItem>
                                            <SelectItem value="percentage">Percentage (%)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {editingOption ? "Update Option" : "Create Option"}
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {Object.entries(groupedOptions).length === 0 ? (
                    <div className="text-center py-10 border rounded-lg bg-muted/20">
                        <p className="text-muted-foreground">No customization options found</p>
                    </div>
                ) : (
                    Object.entries(groupedOptions).map(([type, typeOptions]) => (
                        <Card key={type}>
                            <CardHeader className="py-4 bg-muted/30">
                                <CardTitle className="text-lg capitalize flex items-center gap-2">
                                    {type} <span className="text-xs font-normal text-muted-foreground bg-background px-2 py-1 rounded-full border">{typeOptions.length}</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="divide-y">
                                    {typeOptions.map((option) => (
                                        <div key={option._id} className="flex items-center justify-between p-4 hover:bg-muted/10 transition-colors">
                                            <div className="flex items-center gap-4">
                                                <GripVertical className="h-4 w-4 text-muted-foreground/30" />
                                                <div>
                                                    <p className="font-medium">{option.name}</p>
                                                    <p className="text-xs text-muted-foreground font-mono bg-muted inline-block px-1 rounded">{option.value}</p>
                                                </div>
                                                {option.type === 'color' && (
                                                    <div className="h-6 w-6 rounded-full border shadow-sm" style={{ backgroundColor: option.value }} />
                                                )}
                                                {option.type === 'font' && (
                                                    <span className="text-lg" style={{ fontFamily: option.value }}>Abc</span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-4">
                                                {option.priceModifier > 0 && (
                                                    <span className="text-sm font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                                                        +{option.priceModifier}{option.modifierType === 'percentage' ? '%' : '₹'}
                                                    </span>
                                                )}
                                                <div className="flex items-center gap-1">
                                                    <Button variant="ghost" size="icon" onClick={() => handleEdit(option)}>
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => handleDelete(option._id)}>
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
