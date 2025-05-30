﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Models.DTO_s.Create
{
    public class CreateUsuario
    {
        public string IdEndereco { get; set; }

        [Required]
        public string NomeCompleto { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        public string Telefone { get; set; }

        [Required]
        public int DiaNascimento { get; set; }

        [Required]
        public int MesNascimento { get; set; }

        [Required]
        public int AnoNascimento { get; set; }
        public string PerfilUrl { get; set; }

        [Required, MinLength(6)]
        public string SenhaHash { get; set; }


        [Required]
        public bool isAdmin = false;
    }
}
