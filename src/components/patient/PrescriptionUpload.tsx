import React, { useState, useRef, useCallback } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Upload, Camera, FileText, Eye, EyeOff, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { prescriptionAPI } from '../../lib/api-client';
import { useAppStore } from '../../lib/app-store';

interface PrescriptionUploadProps {
  onNavigate: (path: string) => void;
}

export const PrescriptionUpload: React.FC<PrescriptionUploadProps> = ({ onNavigate }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [ocrResult, setOcrResult] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [patientName, setPatientName] = useState('');
  const [doctorName, setDoctorName] = useState('');
  const [notes, setNotes] = useState('');
  const [medicines, setMedicines] = useState<string[]>(['']);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const { refreshData } = useAppStore();

  const handleFileSelect = useCallback((file: File) => {
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setShowPreview(true);
      // Start OCR processing immediately
      processOCR(file);
    } else {
      toast.error('Please select a valid image file');
    }
  }, []);

  const processOCR = async (file: File) => {
    setIsProcessing(true);
    setOcrResult(null);

    try {
      // Simulate OCR processing with progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Here you would call the OCR API
      // For now, we'll simulate OCR result
      await new Promise(resolve => setTimeout(resolve, 2000));

      clearInterval(progressInterval);
      setUploadProgress(100);

      // Mock OCR result - in real implementation, this would come from backend
      const mockOCRResult = `
Patient Name: John Doe
Doctor: Dr. Smith
Date: 2024-01-15

Medicines:
1. Amoxicillin 500mg - Take 3 times daily for 7 days
2. Ibuprofen 400mg - Take as needed for pain
3. Vitamin D3 1000IU - Take once daily

Notes: Patient has bacterial infection. Monitor for allergic reactions.
      `.trim();

      setOcrResult(mockOCRResult);

      // Auto-fill form fields from OCR result
      const lines = mockOCRResult.split('\n');
      const patientLine = lines.find(line => line.includes('Patient Name:'));
      const doctorLine = lines.find(line => line.includes('Doctor:'));

      if (patientLine) {
        setPatientName(patientLine.replace('Patient Name:', '').trim());
      }
      if (doctorLine) {
        setDoctorName(doctorLine.replace('Doctor:', '').trim());
      }

      // Extract medicines
      const medicineStart = lines.findIndex(line => line.includes('Medicines:'));
      if (medicineStart !== -1) {
        const medicineLines = lines.slice(medicineStart + 1).filter(line =>
          line.trim() && !line.includes('Notes:')
        );
        setMedicines(medicineLines.map(line => line.replace(/^\d+\.\s*/, '').trim()));
      }

      // Extract notes
      const notesStart = lines.findIndex(line => line.includes('Notes:'));
      if (notesStart !== -1) {
        setNotes(lines.slice(notesStart + 1).join(' ').trim());
      }

      toast.success('Prescription scanned successfully!');
    } catch (error) {
      console.error('OCR processing failed:', error);
      toast.error('Failed to process prescription image');
    } finally {
      setIsProcessing(false);
      setUploadProgress(0);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleCameraCapture = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  }, [handleFileSelect]);

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const removeFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setShowPreview(false);
    setOcrResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (cameraInputRef.current) {
      cameraInputRef.current.value = '';
    }
  };

  const addMedicine = () => {
    setMedicines([...medicines, '']);
  };

  const updateMedicine = (index: number, value: string) => {
    const updated = [...medicines];
    updated[index] = value;
    setMedicines(updated);
  };

  const removeMedicine = (index: number) => {
    if (medicines.length > 1) {
      setMedicines(medicines.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!selectedFile) {
      toast.error('Please select a prescription image');
      return;
    }

    if (!patientName.trim()) {
      toast.error('Please enter patient name');
      return;
    }

    if (!doctorName.trim()) {
      toast.error('Please enter doctor name');
      return;
    }

    const filteredMedicines = medicines.filter(med => med.trim());
    if (filteredMedicines.length === 0) {
      toast.error('Please enter at least one medicine');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Get current user from localStorage
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        toast.error('User not authenticated');
        return;
      }

      const user = JSON.parse(userStr);
      const patientId = user.id;
      if (!patientId) {
        toast.error('User not authenticated');
        return;
      }

      // Create FormData for upload
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('patientId', patientId);
      formData.append('patientName', patientName);
      formData.append('doctorId', 'DOC001'); // Default doctor ID - in real app, this would be selected
      formData.append('doctorName', doctorName);
      formData.append('medicines', JSON.stringify(filteredMedicines));
      formData.append('notes', notes);

      // Upload prescription
      const result = await prescriptionAPI.upload(formData);

      // Refresh data to show new prescription
      await refreshData();

      toast.success('Prescription uploaded successfully!');
      onNavigate('/patient/pharmacy/orders');

    } catch (error) {
      console.error('Upload failed:', error);
      toast.error('Failed to upload prescription');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Upload Prescription</h1>
        <p className="text-gray-600">Upload your prescription image for instant processing and medicine ordering</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload Prescription
            </CardTitle>
            <CardDescription>
              Choose an image of your prescription for automatic processing
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!selectedFile ? (
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-900 mb-2">Drop your prescription here</p>
                <p className="text-gray-600 mb-4">or click to browse files</p>
                <div className="flex gap-2 justify-center">
                  <Button
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Choose File
                  </Button>
                  <Button
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      cameraInputRef.current?.click();
                    }}
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    Take Photo
                  </Button>
                </div>
                <p className="text-sm text-gray-500 mt-2">Supports JPG, PNG, JPEG files</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium text-green-900">{selectedFile.name}</p>
                      <p className="text-sm text-green-700">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={removeFile}
                    className="text-red-600 hover:text-red-700"
                  >
                    <XCircle className="h-4 w-4" />
                  </Button>
                </div>

                {showPreview && previewUrl && (
                  <div className="relative">
                    <img
                      src={previewUrl}
                      alt="Prescription preview"
                      className="w-full h-64 object-contain border rounded-lg"
                    />
                    <Button
                      variant="secondary"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => setShowPreview(!showPreview)}
                    >
                      {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                )}

                {isProcessing && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm text-gray-600">Processing prescription...</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleCameraCapture}
              className="hidden"
            />
          </CardContent>
        </Card>

        {/* OCR Results & Form */}
        <Card>
          <CardHeader>
            <CardTitle>Prescription Details</CardTitle>
            <CardDescription>
              Review and edit the extracted information from your prescription
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="patientName">Patient Name</Label>
                  <Input
                    id="patientName"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder="Enter patient name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="doctorName">Doctor Name</Label>
                  <Input
                    id="doctorName"
                    value={doctorName}
                    onChange={(e) => setDoctorName(e.target.value)}
                    placeholder="Enter doctor name"
                    required
                  />
                </div>
              </div>

              <div>
                <Label>Medicines</Label>
                <div className="space-y-2">
                  {medicines.map((medicine, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={medicine}
                        onChange={(e) => updateMedicine(index, e.target.value)}
                        placeholder="Enter medicine name and dosage"
                        required={index === 0}
                      />
                      {medicines.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeMedicine(index)}
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addMedicine}
                  >
                    Add Medicine
                  </Button>
                </div>
              </div>

              <div>
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any additional notes or instructions"
                  rows={3}
                />
              </div>

              {ocrResult && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">OCR Raw Result:</h4>
                  <pre className="text-sm text-blue-800 whitespace-pre-wrap">{ocrResult}</pre>
                </div>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={isUploading || !selectedFile}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Uploading... {uploadProgress}%
                  </>
                ) : (
                  'Upload Prescription'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>How to Upload</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Camera className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-medium mb-1">Take a Photo</h3>
              <p className="text-sm text-gray-600">Use your camera for instant capture</p>
            </div>
            <div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Upload className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-medium mb-1">Upload File</h3>
              <p className="text-sm text-gray-600">Select existing prescription image</p>
            </div>
            <div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <FileText className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-medium mb-1">Auto Process</h3>
              <p className="text-sm text-gray-600">AI extracts medicine details instantly</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
