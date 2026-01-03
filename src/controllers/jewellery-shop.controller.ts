import { NextFunction, Request, Response } from "express";
import { T } from "../libs/types/common";
import MemberService from "../models/Member.service";
import { AdminRequest, LoginInput, MemberInput } from "../libs/types/member";
import { MemberType } from "../libs/enums/member.enum";
import Errors, { HttpCode, Message } from "../libs/Errors";

const memberService = new MemberService();

const jewelleryShopController: T = {};
jewelleryShopController.goHome = (req: Request, res: Response) => {
  try {
    console.log("goHome");
    res.render("home");
  } catch (error) {
    console.error("Error, goHome:", error);
    res.redirect("/admin");
  }
};

jewelleryShopController.getSignup = (req: Request, res: Response) => {
  try {
    console.log("getSignup");
    res.render("signup");
  } catch (error) {
    console.error("Error, getSignup:", error);
    res.redirect("/admin");
  }
};

jewelleryShopController.getLogin = (req: Request, res: Response) => {
  try {
    console.log("getLogin");
    res.render("login");
  } catch (error) {
    console.error("Error, getLogin:", error);
    res.redirect("/admin");
  }
};

jewelleryShopController.processSignup = async (
  req: AdminRequest,
  res: Response
) => {
  try {
    console.log("processSignup");
    const file = req.file;
    if (!file)
      throw new Errors(HttpCode.BAD_REQUEST, Message.SOMETHING_WENT_WRONG);

    const newMember: MemberInput = req.body;
    newMember.memberImage = file?.path.replace(/\\/g, "/");
    newMember.memberType = MemberType.JEWELLERY_SHOP;
    const result = await memberService.processSignup(newMember);

    req.session.member = result;
    req.session.save(function () {
      res.redirect("/admin/product/all");
    });
  } catch (err) {
    console.log("Error, processSignup:", err);
    const message =
      err instanceof Errors ? err.message : Message.SOMETHING_WENT_WRONG;
    res.send(
      `<script> alert("${message}"); window.location.replace('/admin/signup') </script>`
    );
  }
};

jewelleryShopController.processLogin = async (
  req: AdminRequest,
  res: Response
) => {
  try {
    console.log("processLogin");

    const input: LoginInput = req.body;
    const result = await memberService.processLogin(input);

    req.session.member = result; // DB.session(member) & Browser.cookie(sessionID)
    req.session.save(function () {
      res.redirect("/admin/product/all");
    });
  } catch (err) {
    console.log("Error, processLogin", err);
    const message =
      err instanceof Errors ? err.message : Message.SOMETHING_WENT_WRONG;
    res.send(
      `<script> alert("${message}"); window.location.replace('/admin/login') </script>`
    );
  }
};

jewelleryShopController.logout = async (req: AdminRequest, res: Response) => {
  try {
    console.log("logout");
    req.session.destroy(function () {
      res.redirect("/admin");
    });
  } catch (err) {
    console.log("Error, processLogin", err);
    res.redirect("/admin");
  }
};

jewelleryShopController.getUsers = async (req: Request, res: Response) => {
  try {
    console.log("getUsers");
    const result = await memberService.getUsers();
    console.log("Users:", result);

    res.render("users", { users: result });
  } catch (error) {
    console.error("Error, getUsers:", error);
    res.redirect("/admin/login");
  }
};

jewelleryShopController.updateChosenUser = async (
  req: Request,
  res: Response
) => {
  try {
    console.log("updateChosenUser");
    const result = await memberService.updateChosenUser(req.body);

    res.status(HttpCode.OK).json({ data: result });
  } catch (err) {
    console.error("Error, updateChosenUser:", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

jewelleryShopController.checkAuthSession = async (
  req: AdminRequest,
  res: Response
) => {
  try {
    console.log("checkAuthSession");
    if (req.session?.member)
      res.send(
        `<script> alert("Hello, ${req.session.member.memberNick}") </script>`
      );
    else res.send(`<script> alert("${Message.NOT_AUTHENTICATED}") </script>`);
  } catch (err) {
    console.log("Error, processLogin", err);
    res.send(err);
  }
};

jewelleryShopController.verifyJewelleryShop = (
  req: AdminRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.session?.member?.memberType === MemberType.JEWELLERY_SHOP) {
    req.member = req.session.member;
    next();
  } else {
    const message = Message.NOT_AUTHENTICATED;
    res.send(`
      <script> alert("${message}"); window.location.replace('/admin/login'); </script>`);
  }
};

export default jewelleryShopController;
