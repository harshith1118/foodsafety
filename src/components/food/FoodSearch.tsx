// Food search component with multiple input methods
import React, { useState, useRef } from 'react';
import { Camera, Mic, Search, Upload, X, MicOff } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card } from '../ui/Card';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { FoodItem } from '../../types';
import { apiService } from '../../services/api';

interface FoodSearchProps {
  onFoodSelected: (food: FoodItem) => void;
}

export const FoodSearch: React.FC<FoodSearchProps> = ({ onFoodSelected }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<FoodItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [activeMode, setActiveMode] = useState<'text' | 'image' | 'voice'>('text');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  
  // Text search
  const handleTextSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    try {
      const response = await apiService.searchFood(searchQuery);
      setSearchResults(response.data);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Image upload and recognition
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      recognizeImage(file);
    }
  };
  
  const recognizeImage = async (image: File) => {
    setIsLoading(true);
    try {
      const response = await apiService.recognizeFood(image);
      setSearchResults(response.data);
    } catch (error) {
      console.error('Image recognition failed:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Voice recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      const chunks: BlobPart[] = [];
      
      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };
      
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunks, { type: 'audio/wav' });
        await processVoiceInput(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Voice recording failed:', error);
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };
  
  const processVoiceInput = async (audioBlob: Blob) => {
    setIsLoading(true);
    try {
      const response = await apiService.speechToText(audioBlob);
      setSearchQuery(response.data);
      
      // Automatically search after voice recognition
      const searchResponse = await apiService.searchFood(response.data);
      setSearchResults(searchResponse.data);
    } catch (error) {
      console.error('Voice processing failed:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const clearResults = () => {
    setSearchResults([]);
    setSelectedImage(null);
    setSearchQuery('');
  };
  
  return (
    <div className="space-y-6">
      {/* Search Mode Selector */}
      <div className="flex flex-wrap gap-2 justify-center">
        <Button
          variant={activeMode === 'text' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => setActiveMode('text')}
        >
          <Search size={16} className="mr-2" />
          Text Search
        </Button>
        <Button
          variant={activeMode === 'image' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => setActiveMode('image')}
        >
          <Camera size={16} className="mr-2" />
          Image Upload
        </Button>
        <Button
          variant={activeMode === 'voice' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => setActiveMode('voice')}
        >
          <Mic size={16} className="mr-2" />
          Voice Input
        </Button>
      </div>
      
      {/* Search Interface */}
      <Card>
        {activeMode === 'text' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Search by Name</h3>
            <p className="text-gray-600">Tell me what food you'd like to know about! 🔍</p>
            <div className="flex space-x-2">
              <Input
                placeholder="e.g., apple, chicken breast, spinach..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleTextSearch()}
                icon={<Search size={20} />}
                className="flex-1"
              />
              <Button onClick={handleTextSearch} isLoading={isLoading}>
                Search
              </Button>
            </div>
          </div>
        )}
        
        {activeMode === 'image' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Upload Food Image</h3>
            <p className="text-gray-600">Snap a photo and I'll identify the food for you! 📸</p>
            
            {selectedImage ? (
              <div className="relative">
                <img
                  src={URL.createObjectURL(selectedImage)}
                  alt="Selected food"
                  className="w-full h-48 object-cover rounded-lg"
                />
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-emerald-500 transition-colors"
              >
                <Upload size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">Click to upload an image</p>
                <p className="text-sm text-gray-500 mt-2">Supports JPG, PNG files</p>
              </div>
            )}
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>
        )}
        
        {activeMode === 'voice' && (
          <div className="space-y-4 text-center">
            <h3 className="text-lg font-semibold text-gray-900">Voice Input</h3>
            <p className="text-gray-600">Just tell me what food you're curious about! 🎤</p>
            
            <div className="py-8">
              {isRecording ? (
                <div className="space-y-4">
                  <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto animate-pulse">
                    <Mic size={32} className="text-red-600" />
                  </div>
                  <p className="text-red-600 font-medium">Listening...</p>
                  <Button onClick={stopRecording} variant="secondary">
                    <MicOff size={16} className="mr-2" />
                    Stop Recording
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                    <Mic size={32} className="text-emerald-600" />
                  </div>
                  <Button onClick={startRecording}>
                    <Mic size={16} className="mr-2" />
                    Start Recording
                  </Button>
                </div>
              )}
            </div>
            
            {searchQuery && (
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">Recognized speech:</p>
                <p className="font-medium">"{searchQuery}"</p>
              </div>
            )}
          </div>
        )}
      </Card>
      
      {/* Loading State */}
      {isLoading && (
        <Card className="text-center py-8">
          <LoadingSpinner text="Analyzing your food..." />
        </Card>
      )}
      
      {/* Search Results */}
      {searchResults.length > 0 && (
        <Card>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Found {searchResults.length} food{searchResults.length > 1 ? 's' : ''}! 🎉
            </h3>
            <Button variant="ghost" size="sm" onClick={clearResults}>
              <X size={16} className="mr-1" />
              Clear
            </Button>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {searchResults.map((food) => (
              <Card
                key={food.id}
                padding="sm"
                hover
                onClick={() => onFoodSelected(food)}
                className="cursor-pointer"
              >
                {food.imageUrl && (
                  <img
                    src={food.imageUrl}
                    alt={food.name}
                    className="w-full h-32 object-cover rounded-lg mb-3"
                  />
                )}
                <h4 className="font-medium text-gray-900 mb-2">{food.name}</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>{food.calories} calories per {food.servingSize}</p>
                  <p>Protein: {food.nutrients.protein}g</p>
                  <p>Carbs: {food.nutrients.carbs}g</p>
                </div>
              </Card>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};