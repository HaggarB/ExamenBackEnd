create database if not exists DBPrueba;
use DBPrueba;

create table Usuarios (
    usuario_id int primary key auto_increment,
    usuario_nombre varchar(50),
    usuario_apellido varchar(50),
    usuario_email varchar(50)
);

create table Autores (
    autor_id int primary key auto_increment,
    autor_nombre varchar(50),
    autor_apellido varchar(50)
);

create table Libros (
    libro_id int primary key auto_increment,
    libro_nombre varchar(100),
    autor_id int,
    foreign key (autor_id) references Autores(autor_id)
);

DELIMITER $$
create procedure AltaUsuarios(
	in u_nombre varchar(50),
    in u_email varchar(50)
)
begin
	insert into Usuarios (usuario_nombre, usuario_email) values 
    (u_nombre, u_email);
end$$

create procedure BajaUsuarios(
	in u_usuario_id int
)
begin
	delete from Usuarios where usuario_id = u_usuario_id;
end$$

create procedure ConsultaUsuarios()
begin
	select * from Usuarios;
end$$

create procedure AltaAutores(
    in a_nombre varchar(50),
    in a_apellido varchar(50)
)
begin
    insert into Autores (autor_nombre, autor_apellido) values 
    (a_nombre, a_apellido);
end$$

create procedure BajaAutores(
    in a_autor_id int
)
begin
    delete from Autores where autor_id = a_autor_id;
end $$

create procedure ConsultaAutores()
begin
    select * from Autores;
end $$

create procedure AltaLibros(
    in l_nombre varchar(100),
    in l_autor_id int
)
begin
    insert into Libros (libro_nombre, autor_id) values 
    (l_nombre, l_autor_id);
end $$

create procedure BajaLibros(
    in l_libro_id int
)
begin
    delete from Libros where libro_id = l_libro_id;
end $$

create procedure ConsultaLibros()
begin
    select * from Libros;
end $$

create procedure ConsultaLibrosPorAutor(
    in l_autor_id int
)
begin
    select * from Libros where autor_id = l_autor_id;
end $$

create procedure ConsultaAutoresYLibros()
begin
    select Autores.*, COUNT(Libros.libro_id) as NumLibros
    from Autores
    left join Libros on Autores.autor_id = Libros.autor_id
    group by Autores.autor_id;
end $$

DELIMITER ;