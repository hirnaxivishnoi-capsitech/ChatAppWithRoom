using System.ComponentModel.DataAnnotations;

namespace ChatAppWithRoomApi.Models
{
    public class ChangePassword
    {
        [Required(ErrorMessage ="Email is Required")]
        [EmailAddress(ErrorMessage = "Invalid email format.")]
        public string Email { get; set; }

        [Required(ErrorMessage ="Old password is required")]
        public string OldPassword { get; set; }

        [Required(ErrorMessage ="New password is required.")]
      //  [NotEqual("OldPassword", ErrorMessage = "Old password and new password cannot be the same.")]
        public string NewPassword { get; set; }

        [Required(ErrorMessage ="Confrim password is required")]
        [Compare("NewPassword",ErrorMessage =("Confirm password does not match with new password."))]
        public string ConfirmPassword { get; set; }

    }
}
