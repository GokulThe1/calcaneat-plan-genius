import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ObjectUploader } from "@/components/ObjectUploader";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { FileText, Upload, CheckCircle, Clock, AlertCircle, Apple } from "lucide-react";

type Customer = {
  id: string;
  email: string;
  name: string | null;
  role: string;
};

type StageProgress = {
  id: number;
  userId: string;
  stage: number;
  status: 'pending' | 'in_progress' | 'completed';
  startedAt: Date | null;
  completedAt: Date | null;
};

type Document = {
  id: number;
  userId: string;
  stage: number;
  label: string;
  url: string;
  uploadedByRole: string;
  uploadedAt: Date;
};

type Acknowledgement = {
  id: string;
  staffId: string;
  customerId: string;
  taskType: string;
  stage: number | null;
  status: 'pending' | 'acknowledged' | 'completed';
  acknowledgedAt: Date | null;
};

export default function NutritionistPanel() {
  const { toast } = useToast();
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [uploadLabel, setUploadLabel] = useState("");
  const [macros, setMacros] = useState("");
  const [weeklyPlan, setWeeklyPlan] = useState("");
  const reminderShown = useRef(false);

  // Fetch customers with completed stage 3
  const { data: customers = [], isLoading: loadingCustomers } = useQuery<Customer[]>({
    queryKey: ['/api/nutritionist/customers']
  });

  // Fetch customer stage progress
  const { data: stageProgresses = [] } = useQuery<StageProgress[]>({
    queryKey: ['/api/user/stage-progress', selectedCustomer?.id],
    enabled: !!selectedCustomer
  });

  // Fetch customer documents
  const { data: documents = [] } = useQuery<Document[]>({
    queryKey: ['/api/user/documents', selectedCustomer?.id],
    enabled: !!selectedCustomer
  });

  // Fetch staff acknowledgements
  const { data: acknowledgements = [] } = useQuery<Acknowledgement[]>({
    queryKey: ['/api/acknowledgements/staff']
  });

  // Show reminder for pending acknowledgements
  useEffect(() => {
    if (!reminderShown.current && acknowledgements.length > 0) {
      const pendingCount = acknowledgements.filter(ack => ack.status === 'pending').length;
      if (pendingCount > 0) {
        toast({
          title: "Pending Tasks",
          description: `You have ${pendingCount} pending acknowledgement${pendingCount > 1 ? 's' : ''} to review`,
        });
        reminderShown.current = true;
      }
    }
  }, [acknowledgements, toast]);

  // Generate PDF mutation
  const generatePdfMutation = useMutation({
    mutationFn: async (data: { userId: string; macros?: string; weeklyPlan?: string }) => {
      return apiRequest('POST', `/api/nutritionist/diet-plan/${data.userId}/pdf`, {
        macros: data.macros,
        weeklyPlan: data.weeklyPlan
      });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['/api/user/documents', variables.userId] });
      toast({
        title: "PDF Generated",
        description: "Diet chart PDF has been generated successfully"
      });
      setMacros("");
      setWeeklyPlan("");
      setUploadLabel("");
    },
    onError: () => {
      toast({
        title: "Generation Failed",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive"
      });
    }
  });

  // Upload diet chart mutation
  const uploadMutation = useMutation({
    mutationFn: async (data: { userId: string; label: string; url: string; macros?: string; weeklyPlan?: string }) => {
      return apiRequest('POST', '/api/nutritionist/upload-diet-chart', data);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['/api/user/stage-progress', variables.userId] });
      queryClient.invalidateQueries({ queryKey: ['/api/user/documents', variables.userId] });
      queryClient.invalidateQueries({ queryKey: ['/api/acknowledgements/staff'] });
      toast({
        title: "Success",
        description: "Diet chart uploaded successfully"
      });
      setUploadLabel("");
      setMacros("");
      setWeeklyPlan("");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to upload diet chart",
        variant: "destructive"
      });
    }
  });

  // Update acknowledgement mutation
  const acknowledgeMutation = useMutation({
    mutationFn: async (data: { id: string; status: string }) => {
      return apiRequest('PATCH', `/api/acknowledgements/${data.id}`, { status: data.status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/acknowledgements/staff'] });
      toast({
        title: "Success",
        description: "Task acknowledged successfully"
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to acknowledge task",
        variant: "destructive"
      });
    }
  });

  const getUploadParams = async () => {
    const res = await apiRequest('POST', '/api/objects/upload');
    const data = await res.json();
    return {
      method: "PUT" as const,
      url: data.url
    };
  };

  const handleUploadComplete = (result: any) => {
    if (!selectedCustomer || !uploadLabel.trim()) {
      toast({
        title: "Error",
        description: "Please enter a label for the diet chart",
        variant: "destructive"
      });
      return;
    }

    const uploadedFile = result.successful?.[0];
    if (!uploadedFile) {
      toast({
        title: "Error",
        description: "Upload failed",
        variant: "destructive"
      });
      return;
    }

    // Extract object path from presigned URL
    const urlObj = new URL(uploadedFile.uploadURL);
    const objectPath = urlObj.pathname.substring(1); // Remove leading /

    uploadMutation.mutate({
      userId: selectedCustomer.id,
      label: uploadLabel,
      url: objectPath,
      macros: macros || undefined,
      weeklyPlan: weeklyPlan || undefined
    });
  };

  const getStageStatus = (stage: number): 'pending' | 'in_progress' | 'completed' => {
    const progress = stageProgresses.find(p => p.stage === stage);
    return progress?.status || 'pending';
  };

  const getPendingAcknowledgements = () => {
    return acknowledgements.filter(ack => ack.status === 'pending');
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Apple className="h-8 w-8" />
              Nutritionist Panel
            </h1>
            <p className="text-muted-foreground">Create personalized diet charts and meal plans</p>
          </div>
          <Badge variant="outline" className="text-lg px-4 py-2" data-testid="badge-role">
            Nutritionist
          </Badge>
        </div>

        {getPendingAcknowledgements().length > 0 && (
          <Card className="border-yellow-500/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-yellow-500" />
                Pending Acknowledgements ({getPendingAcknowledgements().length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {getPendingAcknowledgements().map(ack => (
                <div key={ack.id} className="flex items-center justify-between p-3 bg-muted rounded-md" data-testid={`acknowledgement-${ack.id}`}>
                  <div>
                    <p className="font-medium">{ack.taskType}</p>
                    <p className="text-sm text-muted-foreground">
                      {ack.stage ? `Stage ${ack.stage}` : 'General'} - Customer: {ack.customerId}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => acknowledgeMutation.mutate({
                      id: ack.id,
                      status: 'acknowledged'
                    })}
                    disabled={acknowledgeMutation.isPending}
                    data-testid={`button-acknowledge-${ack.id}`}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Acknowledge
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Customer List */}
          <Card>
            <CardHeader>
              <CardTitle>Ready for Diet Plan ({customers.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {loadingCustomers ? (
                <div className="flex items-center justify-center py-8">
                  <Clock className="h-6 w-6 animate-spin" />
                </div>
              ) : (
                <div className="space-y-2 max-h-[600px] overflow-y-auto">
                  {customers.length === 0 ? (
                    <p className="text-center text-muted-foreground py-4">No customers ready yet</p>
                  ) : (
                    customers.map(customer => (
                      <button
                        key={customer.id}
                        onClick={() => setSelectedCustomer(customer)}
                        className={`w-full text-left p-3 rounded-md transition-colors ${
                          selectedCustomer?.id === customer.id
                            ? 'bg-primary text-primary-foreground'
                            : 'hover-elevate active-elevate-2'
                        }`}
                        data-testid={`button-customer-${customer.id}`}
                      >
                        <p className="font-medium">{customer.name || 'Unnamed'}</p>
                        <p className="text-sm opacity-80">{customer.email}</p>
                      </button>
                    ))
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Patient Details & Actions */}
          <div className="lg:col-span-2 space-y-6">
            {!selectedCustomer ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">Select a customer to create diet plan</p>
                </CardContent>
              </Card>
            ) : (
              <Tabs defaultValue="overview" className="space-y-4">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="overview" data-testid="tab-overview">Overview</TabsTrigger>
                  <TabsTrigger value="create" data-testid="tab-create">Create Diet Chart</TabsTrigger>
                  <TabsTrigger value="documents" data-testid="tab-documents">Diet Plans</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Patient Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label>Name</Label>
                        <p className="text-lg font-medium" data-testid="text-customer-name">{selectedCustomer.name || 'Not provided'}</p>
                      </div>
                      <div>
                        <Label>Email</Label>
                        <p className="text-lg" data-testid="text-customer-email">{selectedCustomer.email}</p>
                      </div>
                      <div>
                        <Label>Customer ID</Label>
                        <p className="text-sm font-mono" data-testid="text-customer-id">{selectedCustomer.id}</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Stage Progress</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {[1, 2, 3, 4, 5, 6].map(stage => {
                        const status = getStageStatus(stage);
                        const stageName = ['Consultation', 'Test Collection', 'Discussion', 'Diet Chart', 'Payment', 'Delivery'][stage - 1];
                        const isNutritionistStage = stage === 4;
                        return (
                          <div key={stage} className={`flex items-center justify-between p-2 rounded-md ${isNutritionistStage ? 'bg-green-500/10 border border-green-500/20' : 'bg-muted'}`} data-testid={`stage-${stage}`}>
                            <div className="flex items-center gap-3">
                              <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                                status === 'completed' ? 'bg-green-500' :
                                status === 'in_progress' ? 'bg-blue-500' :
                                'bg-gray-500'
                              }`}>
                                <span className="text-white font-semibold">{stage}</span>
                              </div>
                              <div>
                                <p className="font-medium">{stageName} {isNutritionistStage && '(Your Stage)'}</p>
                              </div>
                            </div>
                            <Badge variant={
                              status === 'completed' ? 'default' :
                              status === 'in_progress' ? 'secondary' :
                              'outline'
                            } data-testid={`badge-status-${stage}`}>
                              {status === 'completed' ? 'Completed' :
                               status === 'in_progress' ? 'In Progress' :
                               'Pending'}
                            </Badge>
                          </div>
                        );
                      })}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="create" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Create Diet Chart (Stage 4)</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-md">
                        <p className="text-sm font-medium">Stage 4: Diet Chart Creation</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Create a personalized diet plan based on consultation and test results.
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="upload-label">Diet Plan Name</Label>
                        <Input
                          id="upload-label"
                          placeholder="e.g., Personalized Nutrition Plan, Weight Loss Diet"
                          value={uploadLabel}
                          onChange={(e) => setUploadLabel(e.target.value)}
                          data-testid="input-label"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="macros">Macros (Optional)</Label>
                        <Textarea
                          id="macros"
                          placeholder="e.g., Protein: 150g, Carbs: 200g, Fats: 60g"
                          value={macros}
                          onChange={(e) => setMacros(e.target.value)}
                          data-testid="input-macros"
                          rows={3}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="weekly-plan">Weekly Plan Summary (Optional)</Label>
                        <Textarea
                          id="weekly-plan"
                          placeholder="Describe the weekly meal plan structure..."
                          value={weeklyPlan}
                          onChange={(e) => setWeeklyPlan(e.target.value)}
                          data-testid="input-weekly-plan"
                          rows={4}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Upload Diet Chart (PDF)</Label>
                        <ObjectUploader
                          onGetUploadParameters={getUploadParams}
                          onComplete={handleUploadComplete}
                          maxFileSize={10 * 1024 * 1024}
                          buttonVariant="outline"
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Choose File
                        </ObjectUploader>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <FileText className="h-4 w-4" />
                        <p>Supported formats: PDF (max 10MB)</p>
                      </div>

                      <div className="pt-4 border-t">
                        <p className="text-sm text-muted-foreground mb-3">
                          Or generate a PDF automatically from macros and weekly plan data:
                        </p>
                        <Button
                          onClick={() => selectedCustomer && generatePdfMutation.mutate({
                            userId: selectedCustomer.id,
                            macros,
                            weeklyPlan
                          })}
                          disabled={generatePdfMutation.isPending || !macros || !weeklyPlan}
                          variant="secondary"
                          className="w-full"
                          data-testid="button-generate-pdf"
                        >
                          <FileText className="h-4 w-4 mr-2" />
                          {generatePdfMutation.isPending ? 'Generating PDF...' : 'Generate PDF from Data'}
                        </Button>
                        {(!macros || !weeklyPlan) && (
                          <p className="text-xs text-muted-foreground mt-2">
                            Fill in macros and weekly plan to enable PDF generation
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="documents" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Diet Plans ({documents.filter(d => d.stage === 4).length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {documents.filter(d => d.stage === 4).length === 0 ? (
                        <p className="text-center text-muted-foreground py-8">No diet plans uploaded yet</p>
                      ) : (
                        <div className="space-y-3">
                          {documents.filter(d => d.stage === 4).map(doc => (
                            <div key={doc.id} className="flex items-center justify-between p-3 bg-muted rounded-md" data-testid={`document-${doc.id}`}>
                              <div className="flex items-center gap-3">
                                <FileText className="h-5 w-5 text-muted-foreground" />
                                <div>
                                  <p className="font-medium">{doc.label}</p>
                                  <p className="text-sm text-muted-foreground">
                                    Stage {doc.stage} - Uploaded by {doc.uploadedByRole}
                                  </p>
                                </div>
                              </div>
                              <Button variant="outline" size="sm" asChild data-testid={`button-download-${doc.id}`}>
                                <a href={`/objects/${doc.url}`} download>
                                  Download
                                </a>
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
