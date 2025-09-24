import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";

const dishes = [
  {
    name: "Pizza Margherita",
    status: "Activo",
    price: "12.00€",
    createdAt: "24/05/2024",
  },
  {
    name: "Hamburguesa Clásica",
    status: "Activo",
    price: "9.50€",
    createdAt: "23/05/2024",
  },
  {
    name: "Ensalada César",
    status: "Archivado",
    price: "8.00€",
    createdAt: "22/05/2024",
  },
  {
    name: "Tarta de Queso",
    status: "Activo",
    price: "6.50€",
    createdAt: "21/05/2024",
  },
];

export default function DishesPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="space-y-2 mb-4">
          <h1 className="text-3xl font-bold tracking-tight">Tu Carta</h1>
          <p className="text-muted-foreground">
            Gestiona los platos de tu menú digital.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/dishes/new">Añadir Nuevo Plato</Link>
        </Button>
      </div>

      {/* Dishes Table */}
      <Card>
        <CardHeader>
          <CardTitle>Tus Platos</CardTitle>
          <CardDescription>
            Aquí puedes ver, editar y gestionar todos los platos de tu carta.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Precio</TableHead>
                <TableHead>Creado el</TableHead>
                <TableHead>
                  <span className="sr-only">Acciones</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dishes.map((dish) => (
                <TableRow key={dish.name}>
                  <TableCell className="font-medium">{dish.name}</TableCell>
                  <TableCell>
                    <Badge variant={dish.status === "Activo" ? "default" : "secondary"}>
                      {dish.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{dish.price}</TableCell>
                  <TableCell>{dish.createdAt}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                        <DropdownMenuItem>Editar</DropdownMenuItem>
                        <DropdownMenuItem>Eliminar</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
