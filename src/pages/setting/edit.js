import React, { useState, useEffect } from "react";
import { Button, CircularProgress, Grid } from "@mui/material";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

import axiosInstance from "../../utiles/axiosInstance";
import useGetData from "../../hooks/useGetData";
import DropzoneSingleImage from "../../components/UI/DropzoneSingleImage/DropzoneSingleImage";


const SettingEdit = () => {
  const [titleSeo, setTitleSeo] = useState("");
  const [description, setDescription] = useState("");
  const [firstPageHeader, setFirstPageHeader] = useState("");
  const [firstPageHeaderBold, setFirstPageHeaderBold] = useState("");
  const [brandCount, setBrandCount] = useState("");
  const [comparisonCount, setComparisonCount] = useState("");
  const [couponCount, setCouponCount] = useState("");
  const [bestRatingCount, setBestRatingCount] = useState("");
  const [reviewCount, setReviewCount] = useState("");
  const [footerInfo, setFooterInfo] = useState("");
  const [footerContent, setFooterContent] = useState("");
  const [footerContact, setFooterContact] = useState("");
  const [tiktok, setTiktok] = useState("");
  const [facebook, setFacebook] = useState("");
  const [twitter, setTwitter] = useState("");
  const [pinterest, setPinterest] = useState("");
  const [firstPageBanner, setFirstPageBanner] = useState([]);
  const [logo, setLogo] = useState([]);
  const [favicon, setFavicon] = useState([]);
  const [instagram, setInstagram] = useState("");


  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState({});

  const navigate = useNavigate();


  const { loading: fetchCouponLoading, data: setting, getData } = useGetData();

  useEffect(() => {
    getData("/admin/setting/");
  }, [getData]);


  useEffect(() => {
    if (!setting) {
    return;
    }
    setTitleSeo(setting.titleSeo);
    setDescription(setting.description);
    setFirstPageHeader(setting.firstPageHeader);
    setFirstPageHeaderBold(setting.firstPageHeaderBold);
    setBrandCount(setting.brandCount);
    setComparisonCount(setting.comparisonCount);
    setCouponCount(setting.couponCount);
    setBestRatingCount(setting.bestRatingCount);
    setReviewCount(setting.reviewCount);
    setFooterInfo(setting.footerInfo);
    setFooterContent(setting.footerContent);
    setFooterContact(setting.footerContact);
    setTiktok(setting.tiktok);
    setFacebook(setting.facebook);
    setTwitter(setting.twitter);
    setPinterest(setting.pinterest);
    setInstagram(setting.instagram);

    setFirstPageBanner([
        {
            preview:
            process.env.REACT_APP_BACKEND_API_URL + setting.firstPageBanner,
            name: setting.firstPageBanner.fileName,
            alt: setting.firstPageBanner.alt,
        }
    ]);

    setLogo([
        {
            preview:
            process.env.REACT_APP_BACKEND_API_URL + setting.logo,
            name: setting.logo.fileName,
            alt: setting.logo.alt,
        }
    ]);

    setFavicon([
        {
            preview:
            process.env.REACT_APP_BACKEND_API_URL + setting.favicon,
            name: setting.favicon.fileName,
            alt: setting.favicon.alt,
        }
    ]);

}, [setting]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage({});
    try {

        const formData = new FormData();
        formData.append("titleSeo", titleSeo);
        formData.append("description", description);
        formData.append("firstPageHeader", firstPageHeader);
        formData.append("firstPageHeaderBold", firstPageHeaderBold);
        formData.append("brandCount", brandCount);
        formData.append("comparisonCount", comparisonCount);
        formData.append("couponCount", couponCount);
        formData.append("bestRatingCount", bestRatingCount);
        formData.append("reviewCount", reviewCount);
        formData.append("footerInfo", footerInfo);
        formData.append("footerContent", footerContent);
        formData.append("footerContact", footerContact);
        formData.append("tiktok", tiktok);
        formData.append("facebook", facebook);
        formData.append("twitter", twitter);
        formData.append("pinterest", pinterest);
        formData.append("instagram", instagram);

        if (firstPageBanner[0] && firstPageBanner[0].type) {
            formData.append("firstPageBanner", firstPageBanner[0]);
        }
        if (logo[0] && logo[0].type) {
            formData.append("logo", logo[0]);
        }
        if (favicon[0] && favicon[0].type) {
            formData.append("favicon", favicon[0]);
        }

        await axiosInstance.put("/admin/setting/", formData);
        setLoading(false);
        toast.success("Edited Successfully.");
        navigate("/setting");
    } catch (error) {
      console.log(error);
      if (error.response?.data?.error) {
        setErrorMessage(error.response?.data?.error);
      }
      setLoading(false);
    }
  };


  return (
    <React.Fragment>
      <Grid container justifyContent="center">
        <Grid item xs={12}>
          <div className="card mb-12rem  ">
            {fetchCouponLoading ? (
              <div className="d-flex justify-content-center">
                <CircularProgress className="me-3" color="inherit" />
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <Grid container spacing={2} className={"w-100 m-0 p-1"}>


                  <Grid item xs={12} md={6}>
                    <div>
                      <label className="form-label" htmlFor="titleSeo">
                        Title seo
                      </label>
                      <input
                        className={`form-input ${Array.isArray(errorMessage?.titleSeo) ? "is-invalid" : ""
                          }`}
                        id="titleSeo"
                        value={titleSeo}
                        onChange={(e) =>
                          setTitleSeo(e.target.value)
                        }
                      />
                      <div className="text-danger">
                        {Array.isArray(errorMessage?.title) &&
                          errorMessage?.title.map((error, index) => (
                            <p key={index}>{error}</p>
                          ))}
                      </div>
                    </div>
                  </Grid>


                  <Grid item xs={12} md={6}>
                    <div>
                      <label className="form-label" htmlFor="description">
                        Meta Description
                      </label>
                      <textarea
                        className={`form-input ${Array.isArray(errorMessage?.description)
                            ? "is-invalid"
                            : ""
                          }`}
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        onBlur={(e) =>
                            setDescription(e?.target?.value)
                        }
                      />
                      <div className="text-danger">
                        {Array.isArray(errorMessage?.description) &&
                          errorMessage?.description.map((error, index) => (
                            <p key={index}>{error}</p>
                          ))}
                      </div>
                    </div>
                  </Grid>



                  <Grid item xs={12} md={6}>
                    <div>
                      <label className="form-label" htmlFor="firstPageHeaderBold">
                        First Page Text Bold
                      </label>
                      <input
                        className={`form-input ${Array.isArray(errorMessage?.firstPageHeaderBold) ? "is-invalid" : ""
                          }`}
                        id="firstPageHeaderBold"
                        value={firstPageHeaderBold}
                        onChange={(e) =>
                          setFirstPageHeaderBold(e.target.value)
                        }
                      />
                      <div className="text-danger">
                        {Array.isArray(errorMessage?.firstPageHeaderBold) &&
                          errorMessage?.firstPageHeaderBold.map((error, index) => (
                            <p key={index}>{error}</p>
                          ))}
                      </div>
                    </div>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <div>
                      <label className="form-label" htmlFor="firstPageHeader">
                        First Page Text 
                      </label>
                      <input
                        className={`form-input ${Array.isArray(errorMessage?.firstPageHeader) ? "is-invalid" : ""
                          }`}
                        id="firstPageHeader"
                        value={firstPageHeader}
                        onChange={(e) =>
                            setFirstPageHeader(e.target.value)
                        }
                      />
                      <div className="text-danger">
                        {Array.isArray(errorMessage?.firstPageHeader) &&
                          errorMessage?.firstPageHeader.map((error, index) => (
                            <p key={index}>{error}</p>
                          ))}
                      </div>
                    </div>
                  </Grid>



                  <Grid item xs={12} md={3}>
                    <div>
                      <label className="form-label" htmlFor="brandCount">
                        Brand Count
                      </label>
                      <input
                        className={`form-input ${Array.isArray(errorMessage?.brandCount) ? "is-invalid" : ""
                          }`}
                        id="brandCount"
                        value={brandCount}
                        onChange={(e) =>
                            setBrandCount(e.target.value)
                        }
                      />
                      <div className="text-danger">
                        {Array.isArray(errorMessage?.brandCount) &&
                          errorMessage?.brandCount.map((error, index) => (
                            <p key={index}>{error}</p>
                          ))}
                      </div>
                    </div>
                  </Grid>

                  <Grid item xs={12} md={3}>
                    <div>
                      <label className="form-label" htmlFor="comparisonCount">
                      Comparison Count
                      </label>
                      <input
                        className={`form-input ${Array.isArray(errorMessage?.comparisonCount) ? "is-invalid" : ""
                          }`}
                        id="comparisonCount"
                        value={comparisonCount}
                        onChange={(e) =>
                            setComparisonCount(e.target.value)
                        }
                      />
                      <div className="text-danger">
                        {Array.isArray(errorMessage?.comparisonCount) &&
                          errorMessage?.comparisonCount.map((error, index) => (
                            <p key={index}>{error}</p>
                          ))}
                      </div>
                    </div>
                  </Grid>

                  <Grid item xs={12} md={2}>
                    <div>
                      <label className="form-label" htmlFor="couponCount">
                      Coupon Count
                      </label>
                      <input
                        className={`form-input ${Array.isArray(errorMessage?.couponCount) ? "is-invalid" : ""
                          }`}
                        id="couponCount"
                        value={couponCount}
                        onChange={(e) =>
                            setCouponCount(e.target.value)
                        }
                      />
                      <div className="text-danger">
                        {Array.isArray(errorMessage?.couponCount) &&
                          errorMessage?.couponCount.map((error, index) => (
                            <p key={index}>{error}</p>
                          ))}
                      </div>
                    </div>
                  </Grid>

                  <Grid item xs={12} md={2}>
                    <div>
                      <label className="form-label" htmlFor="bestRatingCount">
                      Best Rating Count
                      </label>
                      <input
                        className={`form-input ${Array.isArray(errorMessage?.bestRatingCount) ? "is-invalid" : ""
                          }`}
                        id="bestRatingCount"
                        value={bestRatingCount}
                        onChange={(e) =>
                            setBestRatingCount(e.target.value)
                        }
                      />
                      <div className="text-danger">
                        {Array.isArray(errorMessage?.bestRatingCount) &&
                          errorMessage?.bestRatingCount.map((error, index) => (
                            <p key={index}>{error}</p>
                          ))}
                      </div>
                    </div>
                  </Grid>

                  <Grid item xs={12} md={2}>
                    <div>
                      <label className="form-label" htmlFor="reviewCount">
                      Review Count
                      </label>
                      <input
                        className={`form-input ${Array.isArray(errorMessage?.reviewCount) ? "is-invalid" : ""
                          }`}
                        id="reviewCount"
                        value={reviewCount}
                        onChange={(e) =>
                            setReviewCount(e.target.value)
                        }
                      />
                      <div className="text-danger">
                        {Array.isArray(errorMessage?.reviewCount) &&
                          errorMessage?.reviewCount.map((error, index) => (
                            <p key={index}>{error}</p>
                          ))}
                      </div>
                    </div>
                  </Grid>








                  <Grid item xs={12} md={6}>
                    <div>
                      <label className="form-label" htmlFor="footerInfo">
                        Footer Info
                      </label>
                      <textarea
                        className={`form-input ${Array.isArray(errorMessage?.footerInfo)
                            ? "is-invalid"
                            : ""
                          }`}
                        id="footerInfo"
                        value={footerInfo}
                        onChange={(e) => setFooterInfo(e.target.value)}
                        onBlur={(e) =>
                            setFooterInfo(e?.target?.value)
                        }
                      />
                      <div className="text-danger">
                        {Array.isArray(errorMessage?.footerInfo) &&
                          errorMessage?.footerInfo.map((error, index) => (
                            <p key={index}>{error}</p>
                          ))}
                      </div>
                    </div>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <div>
                      <label className="form-label" htmlFor="footerContent">
                        Footer Content
                      </label>
                      <textarea
                        className={`form-input ${Array.isArray(errorMessage?.footerContent)
                            ? "is-invalid"
                            : ""
                          }`}
                        id="footerContent"
                        value={footerContent}
                        onChange={(e) => setFooterContent(e.target.value)}
                        onBlur={(e) =>
                            setFooterContent(e?.target?.value)
                        }
                      />
                      <div className="text-danger">
                        {Array.isArray(errorMessage?.footerContent) &&
                          errorMessage?.footerContent.map((error, index) => (
                            <p key={index}>{error}</p>
                          ))}
                      </div>
                    </div>
                  </Grid>

                  <Grid item xs={12} md={12}>
                    <div>
                      <label className="form-label" htmlFor="footerContact">
                        Footer Contact
                      </label>
                      <textarea
                        className={`form-input ${Array.isArray(errorMessage?.footerContact)
                            ? "is-invalid"
                            : ""
                          }`}
                        id="footerContact"
                        value={footerContact}
                        onChange={(e) => setFooterContact(e.target.value)}
                        onBlur={(e) =>
                            setFooterContact(e?.target?.value)
                        }
                      />
                      <div className="text-danger">
                        {Array.isArray(errorMessage?.footerContact) &&
                          errorMessage?.footerContact.map((error, index) => (
                            <p key={index}>{error}</p>
                          ))}
                      </div>
                    </div>
                  </Grid>



                  <Grid item xs={12} md={2}>
                    <div>
                      <label className="form-label" htmlFor="tiktok">
                      Tiktok
                      </label>
                      <input
                        className={`form-input ${Array.isArray(errorMessage?.tiktok) ? "is-invalid" : ""
                          }`}
                        id="tiktok"
                        value={tiktok}
                        onChange={(e) =>
                            setTiktok(e.target.value)
                        }
                      />
                      <div className="text-danger">
                        {Array.isArray(errorMessage?.tiktok) &&
                          errorMessage?.tiktok.map((error, index) => (
                            <p key={index}>{error}</p>
                          ))}
                      </div>
                    </div>
                  </Grid>

                  <Grid item xs={12} md={2}>
                    <div>
                      <label className="form-label" htmlFor="facebook">
                      Facebook
                      </label>
                      <input
                        className={`form-input ${Array.isArray(errorMessage?.facebook) ? "is-invalid" : ""
                          }`}
                        id="facebook"
                        value={facebook}
                        onChange={(e) =>
                            setFacebook(e.target.value)
                        }
                      />
                      <div className="text-danger">
                        {Array.isArray(errorMessage?.facebook) &&
                          errorMessage?.facebook.map((error, index) => (
                            <p key={index}>{error}</p>
                          ))}
                      </div>
                    </div>
                  </Grid>


                  <Grid item xs={12} md={2}>
                    <div>
                      <label className="form-label" htmlFor="twitter">
                      Twitter
                      </label>
                      <input
                        className={`form-input ${Array.isArray(errorMessage?.twitter) ? "is-invalid" : ""
                          }`}
                        id="twitter"
                        value={twitter}
                        onChange={(e) =>
                            setTwitter(e.target.value)
                        }
                      />
                      <div className="text-danger">
                        {Array.isArray(errorMessage?.twitter) &&
                          errorMessage?.twitter.map((error, index) => (
                            <p key={index}>{error}</p>
                          ))}
                      </div>
                    </div>
                  </Grid>

                  <Grid item xs={12} md={2}>
                    <div>
                      <label className="form-label" htmlFor="pinterest">
                      Pinterest
                      </label>
                      <input
                        className={`form-input ${Array.isArray(errorMessage?.pinterest) ? "is-invalid" : ""
                          }`}
                        id="pinterest"
                        value={pinterest}
                        onChange={(e) =>
                            setPinterest(e.target.value)
                        }
                      />
                      <div className="text-danger">
                        {Array.isArray(errorMessage?.pinterest) &&
                          errorMessage?.pinterest.map((error, index) => (
                            <p key={index}>{error}</p>
                          ))}
                      </div>
                    </div>
                  </Grid>

                  <Grid item xs={12} md={2}>
                    <div>
                      <label className="form-label" htmlFor="instagram">
                      Instagram
                      </label>
                      <input
                        className={`form-input ${Array.isArray(errorMessage?.instagram) ? "is-invalid" : ""
                          }`}
                        id="instagram"
                        value={instagram}
                        onChange={(e) =>
                            setInstagram(e.target.value)
                        }
                      />
                      <div className="text-danger">
                        {Array.isArray(errorMessage?.instagram) &&
                          errorMessage?.instagram.map((error, index) => (
                            <p key={index}>{error}</p>
                          ))}
                      </div>
                    </div>
                  </Grid>





              
                      <Grid item xs={12} md={6}>
                        <div className="mb-3">
                          <label className="form-label" htmlFor="firstPageBanner">
                          First Page Banner
                          </label>
                          <DropzoneSingleImage
                            files={firstPageBanner}
                            setFiles={setFirstPageBanner}
                          />
                          <div className="text-danger">
                            {Array.isArray(errorMessage?.firstPageBanner) &&
                              errorMessage?.firstPageBanner.map((error, index) => (
                                <p key={index}>{error}</p>
                              ))}
                          </div>
                        </div>
                      </Grid>



                      <Grid item xs={12} md={6}>
                        <div className="mb-3">
                          <label className="form-label" htmlFor="logo">
                           Logo
                          </label>
                          <DropzoneSingleImage
                            files={logo}
                            setFiles={setLogo}
                          />
                          <div className="text-danger">
                            {Array.isArray(errorMessage?.logo) &&
                              errorMessage?.logo.map((error, index) => (
                                <p key={index}>{error}</p>
                              ))}
                          </div>
                        </div>
                      </Grid>

                      <Grid item xs={12} md={12}>
                        <div className="mb-3">
                          <label className="form-label" htmlFor="favicon">
                            Favicon
                          </label>
                          <DropzoneSingleImage
                            files={favicon}
                            setFiles={setFavicon}
                          />
                          <div className="text-danger">
                            {Array.isArray(errorMessage?.favicon) &&
                              errorMessage?.favicon.map((error, index) => (
                                <p key={index}>{error}</p>
                              ))}
                          </div>
                        </div>
                      </Grid>
    




                  <Grid item xs={12}>
                    <div className="d-flex pt-2">
                      <Button
                        type="submit"
                        variant="contained"
                        disabled={loading}
                      >
                        Submit
                      </Button>
                      {loading ? (
                        <CircularProgress className="me-3" color="inherit" />
                      ) : null}
                    </div>
                  </Grid>
                </Grid>
              </form>
            )}
          </div>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default SettingEdit;