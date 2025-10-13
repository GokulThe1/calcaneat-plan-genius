import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Users, FileText, CheckCircle2, Clock } from 'lucide-react';
import type { User, Milestone, Report } from '@shared/schema';
import { isUnauthorizedError } from '@/lib/authUtils';

export default function Admin() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading, user } = useAuth();
  const [selectedCustomer, setSelectedCustomer] = useState<string>('');

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }

    if (!isLoading && user && user.role !== 'admin' && user.role !== 'clinical') {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access this page.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, user, toast]);

  const isAuthorized = isAuthenticated && user && (user.role === 'admin' || user.role === 'clinical');

  const { data: customers, isLoading: loadingCustomers } = useQuery<User[]>({
    queryKey: ['/api/admin/customers'],
    enabled: isAuthorized,
  });

  const { data: milestones } = useQuery<Milestone[]>({
    queryKey: ['/api/admin/milestones', selectedCustomer],
    enabled: !!selectedCustomer && isAuthorized,
  });

  const { data: reports } = useQuery<Report[]>({
    queryKey: ['/api/admin/reports', selectedCustomer],
    enabled: !!selectedCustomer && isAuthorized,
  });

  const updateMilestoneMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      await apiRequest('PATCH', `/api/admin/milestones/${id}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/milestones', selectedCustomer] });
      toast({
        title: "Success",
        description: "Milestone updated successfully",
      });
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to update milestone",
        variant: "destructive",
      });
    },
  });

  const createReportMutation = useMutation({
    mutationFn: async (report: { userId: string; reportType: string; title: string; summary: string }) => {
      await apiRequest('POST', '/api/admin/reports', report);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/reports', selectedCustomer] });
      toast({
        title: "Success",
        description: "Report created successfully",
      });
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to create report",
        variant: "destructive",
      });
    },
  });

  if (isLoading || loadingCustomers || !isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold mb-2" data-testid="text-admin-title">
            Clinical Admin Panel
          </h1>
          <p className="text-muted-foreground">Manage customer milestones and reports</p>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Select Customer
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
                <SelectTrigger data-testid="select-customer">
                  <SelectValue placeholder="Choose a customer" />
                </SelectTrigger>
                <SelectContent>
                  {customers?.map((customer) => (
                    <SelectItem key={customer.id} value={customer.id} data-testid={`select-customer-${customer.id}`}>
                      {customer.email} - {customer.firstName} {customer.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {selectedCustomer && (
            <Tabs defaultValue="milestones" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="milestones" data-testid="tab-milestones">
                  Milestones
                </TabsTrigger>
                <TabsTrigger value="reports" data-testid="tab-reports">
                  Reports
                </TabsTrigger>
              </TabsList>

              <TabsContent value="milestones" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Customer Milestones</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {milestones?.map((milestone) => (
                      <div
                        key={milestone.id}
                        className="flex items-center justify-between p-4 border rounded-md"
                        data-testid={`milestone-${milestone.id}`}
                      >
                        <div className="flex items-center gap-3">
                          {milestone.status === 'completed' ? (
                            <CheckCircle2 className="h-5 w-5 text-primary" />
                          ) : (
                            <Clock className="h-5 w-5 text-muted-foreground" />
                          )}
                          <div>
                            <p className="font-medium">{milestone.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {milestone.status === 'completed' 
                                ? `Completed ${new Date(milestone.completedAt!).toLocaleDateString()}`
                                : 'In Progress'}
                            </p>
                          </div>
                        </div>
                        <Select
                          value={milestone.status}
                          onValueChange={(status) => 
                            updateMilestoneMutation.mutate({ id: milestone.id, status })
                          }
                          disabled={updateMilestoneMutation.isPending}
                        >
                          <SelectTrigger className="w-[150px]" data-testid={`select-milestone-status-${milestone.id}`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="locked">Locked</SelectItem>
                            <SelectItem value="in_progress">In Progress</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reports" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Create New Report</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        const formData = new FormData(e.currentTarget);
                        createReportMutation.mutate({
                          userId: selectedCustomer,
                          reportType: formData.get('reportType') as string,
                          title: formData.get('title') as string,
                          summary: formData.get('summary') as string,
                        });
                        e.currentTarget.reset();
                      }}
                      className="space-y-4"
                    >
                      <div className="space-y-2">
                        <Label htmlFor="reportType">Report Type</Label>
                        <Select name="reportType" required>
                          <SelectTrigger data-testid="select-report-type">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="test_result">Test Result</SelectItem>
                            <SelectItem value="diagnosis">Diagnosis</SelectItem>
                            <SelectItem value="diet_chart">Diet Chart</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                          id="title"
                          name="title"
                          placeholder="Report title"
                          required
                          data-testid="input-report-title"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="summary">Summary</Label>
                        <Textarea
                          id="summary"
                          name="summary"
                          placeholder="Report summary or findings"
                          rows={4}
                          required
                          data-testid="textarea-report-summary"
                        />
                      </div>

                      <Button
                        type="submit"
                        disabled={createReportMutation.isPending}
                        data-testid="button-create-report"
                      >
                        {createReportMutation.isPending ? 'Creating...' : 'Create Report'}
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Existing Reports</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {reports?.map((report) => (
                      <div
                        key={report.id}
                        className="p-4 border rounded-md"
                        data-testid={`report-${report.id}`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <FileText className="h-5 w-5 text-primary" />
                            <p className="font-medium">{report.title}</p>
                          </div>
                          <Badge variant="secondary">{report.reportType.replace('_', ' ')}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{report.summary}</p>
                        <p className="text-xs text-muted-foreground mt-2">
                          Created {new Date(report.createdAt!).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
    </div>
  );
}
