import { type FormEvent, useEffect, useState } from "react";
import { useAuth } from "@/auth/AuthContext";
import {
  createEmployee,
  getEmployees,
  type Employee,
} from "@/api/employee.api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function Employees() {
  const { token } = useAuth();

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadEmployees = async () => {
    if (!token) return;

    try {
      const data = await getEmployees(token);
      setEmployees(data);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to load employees"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, [token]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!token) return;

    setError("");
    setSuccess("");
    setCreating(true);

    try {
      await createEmployee(
        {
          name,
          email,
          password,
        },
        token
      );

      setName("");
      setEmail("");
      setPassword("");
      setSuccess("Employee created successfully.");

      await loadEmployees();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to create employee"
      );
    } finally {
      setCreating(false);
    }
  };

  return (
    <main className="min-h-screen bg-muted/40 p-6">
      <div className="mx-auto max-w-6xl space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Employees</h1>
          <p className="mt-1 text-muted-foreground">
            Manage employees in your organization.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Add Employee</CardTitle>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="John Doe"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="john@example.com"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Temporary password"
                    required
                  />
                </div>

                {error && (
                  <p className="text-sm text-destructive">{error}</p>
                )}

                {success && (
                  <p className="text-sm text-green-600">{success}</p>
                )}

                <Button
                  type="submit"
                  className="w-full"
                  disabled={creating}
                >
                  {creating ? "Creating..." : "Create Employee"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>
                Employees ({employees.length})
              </CardTitle>
            </CardHeader>

            <CardContent>
              {loading ? (
                <p className="text-sm text-muted-foreground">
                  Loading employees...
                </p>
              ) : employees.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No employees have been added yet.
                </p>
              ) : (
                <div className="space-y-3">
                  {employees.map((employee) => (
                    <div
                      key={employee.id}
                      className="flex items-center justify-between rounded-lg border p-4"
                    >
                      <div>
                        <p className="font-medium">{employee.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {employee.email}
                        </p>
                      </div>

                      <span className="text-sm text-muted-foreground">
                        Employee
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}

export default Employees;